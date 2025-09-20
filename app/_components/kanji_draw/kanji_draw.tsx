"use client";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  kanji: string;
  verify_callback: (correct: boolean) => void;
}

interface Point {
  x: number;
  y: number;
}

interface CanvasSettings {
  width: number;
  height: number;
  background_color: string;
  background_line_color: string;
  background_line_width: number;
  line_dash: number[];
  stroke_colors: string[];
  line_number_font: string;
}

const canvas_settings: CanvasSettings = {
  width: 500,
  height: 500,
  background_color: "#212121",
  background_line_color: "#424242",
  background_line_width: 3,
  line_dash: [5, 3],
  stroke_colors: [
    "#bf0000",
    "#bf5600",
    "#bfac00",
    "#7cbf00",
    "#26bf00",
    "#00bf2f",
    "#00bf85",
    "#00a2bf",
    "#004cbf",
    "#0900bf",
    "#5f00bf",
    "#b500bf",
    "#bf0072",
    "#bf001c",
    "#bf2626",
    "#bf6b26",
    "#bfaf26",
    "#89bf26",
    "#44bf26",
    "#26bf4c",
    "#26bf91",
    "#26a8bf",
    "#2663bf",
    "#2d26bf",
    "#7226bf",
    "#b726bf",
    "#bf2682",
    "#bf263d",
    "#bf4c4c",
    "#bf804c",
  ],
  line_number_font: "20px serif",
};

function findxy(e: React.MouseEvent<HTMLCanvasElement>): Point {
  const bb = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - bb.left) / bb.width) * e.currentTarget.width;
  const y = ((e.clientY - bb.top) / bb.height) * e.currentTarget.height;

  return {
    x: Math.floor(x),
    y: Math.floor(y),
  };
}

async function loadSVG(kanji: string): Promise<string> {
  const kanji_svg_url =
    "/kanji_svg/" + kanji.charCodeAt(0).toString(16).padStart(5, "0") + ".svg";
  const res = await fetch(kanji_svg_url);
  return await res.text();
}

async function verify_kanji(
  lines: Point[][],
  kanji: string,
  canvas: HTMLCanvasElement | null,
  debug: boolean,
  verify_threshold: number, //percent
  max_move: number, //percent how far it can correct
): Promise<boolean> {
  const svg_txt = await loadSVG(kanji);
  const parser = new DOMParser();
  const svg_doc = parser.parseFromString(svg_txt, "image/svg+xml");
  const svg = svg_doc.querySelector("svg");
  const svg_paths = svg_doc.querySelectorAll("path");

  if (!canvas) {
    return false;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }

  if (lines.length != svg_paths.length) {
    console.log("Missmatch in the number of lines");
    return false;
  }
  if (!svg) {
    console.log("svg does not exist in svg");
    return false;
  }
  const viewbox = svg.getAttribute("viewBox");

  if (!viewbox) {
    console.log("ViewBox not defined for svg");
    return false;
  }
  const [vx, vy, vw, vh] = viewbox.split(" ").map(Number);
  const scaleX = canvas_settings.width / vw;
  const scaleY = canvas_settings.height / vh;
  const distances = [];

  for (let lineIdx = 0; lineIdx < svg_paths.length; lineIdx++) {
    const path_len = svg_paths[lineIdx].getTotalLength();
    const num_points = lines[lineIdx].length;

    //calculate the distances between the points
    const line_point_dist = [];
    for (let i = 1; i < num_points; i++) {
      const dx = lines[lineIdx][i - 1].x - lines[lineIdx][i].x;
      const dy = lines[lineIdx][i - 1].y - lines[lineIdx][i].y;
      line_point_dist.push(Math.sqrt(dx * dx + dy * dy));
    }
    const line_len = line_point_dist.reduce((sum, cur) => sum + cur);
    const distanceArray = [];
    const pathPoints = [];
    let cur_len = 0;
    for (let pointIdx = 0; pointIdx < num_points; pointIdx++) {
      const len_percent = cur_len / line_len;
      cur_len += line_point_dist[pointIdx];
      const pathPoint = svg_paths[lineIdx].getPointAtLength(
        path_len * len_percent,
      );
      const pointX = (pathPoint.x - vx) * scaleX;
      const pointY = (pathPoint.y - vy) * scaleY;

      pathPoints.push({
        x: pointX,
        y: pointY,
      });

      const linePoint = lines[lineIdx][pointIdx];
      const dx = linePoint.x - pointX;
      const dy = linePoint.y - pointY;
      distanceArray.push({
        x: dx,
        y: dy,
      });
    }
    distances.push(distanceArray);

    if (debug) {
      draw_line(ctx, pathPoints, "#00ffff");
    }
  }

  const normDistances = [];

  //normalize distances
  let idx = 0;
  for (const distArray of distances) {
    const avgDx =
      distArray.reduce((sum, curr) => sum + curr.x, 0) / distArray.length;
    const avgDy =
      distArray.reduce((sum, curr) => sum + curr.y, 0) / distArray.length;

    if (debug) {
      draw_line(
        ctx,
        lines[idx].map((p) => ({ x: p.x - avgDx, y: p.y - avgDy })),
        "#ff00ff",
      );
    }
    normDistances.push(
      distArray.map((e) => ({
        x: e.x - avgDx,
        y: e.y - avgDy,
      })),
    );

    const move_percent =
      Math.sqrt(avgDx * avgDx + avgDy * avgDy) /
      Math.sqrt(canvas.height * canvas.width);

    if (move_percent > max_move) {
      console.log("Correction threshold reached");
      return false;
    }
    idx++;
  }

  for (const normDistArray of normDistances) {
    const distance =
      normDistArray
        .map((e) => Math.sqrt(e.x * e.x + e.y * e.y))
        .reduce((sum, cur) => sum + cur, 0) / normDistArray.length;

    const percent = distance / Math.sqrt(canvas.height * canvas.width);

    if (percent > verify_threshold) {
      console.log("verify threshold reached");
      return false;
    }
  }

  return true;
}

async function show_svg_in_canvas(
  canvas: HTMLCanvasElement | null,
  kanji: string,
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let svg_str = await loadSVG(kanji);
  svg_str = svg_str.replace("#000000", "#ffffff");
  const blob = new Blob([svg_str], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.style.filter = "invert(1)";
  img.onload = () =>
    ctx.drawImage(img, 0, 0, canvas_settings.width, canvas_settings.height);
  img.src = url;
}

function clear_canvas(
  canvas: HTMLCanvasElement | null,
  setDrawPoints: (drawPoints: Point[]) => void,
  setLines: (lines: Point[][]) => void,
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  setLines([]);
  setDrawPoints([]);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_background(ctx);
}

function draw_line(
  ctx: CanvasRenderingContext2D,
  line: Point[],
  color: string,
) {
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);
  ctx.strokeStyle = color;
  for (const point of line) {
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
  ctx.closePath();
}

function undo_canvas(
  canvas: HTMLCanvasElement | null,
  setDrawPoints: (drawPoints: Point[]) => void,
  lines: Point[][],
  setLines: (lines: Point[][]) => void,
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  lines.pop();
  clear_canvas(canvas, setDrawPoints, setLines);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillStyle = canvas_settings.stroke_colors[i];
    draw_line(ctx, lines[i], canvas_settings.stroke_colors[i]);
    ctx.font = canvas_settings.line_number_font;
    ctx.fillText(
      i + 1 + "",
      lines[i][lines[i].length - 1].x,
      lines[i][lines[i].length - 1].y,
    );
  }
  setLines(lines);
}

function mouseChange(
  e: React.MouseEvent<HTMLCanvasElement>,
  mouseDown: boolean,
  setMouseDown: (mouseDown: boolean) => void,
  drawPoints: Point[],
  setDrawPoints: (drawPoints: Point[]) => void,
  lines: Point[][],
  setLines: (lines: Point[][]) => void,
) {
  const ctx = e.currentTarget.getContext("2d");
  if (!ctx) return;

  const point = findxy(e);
  ctx.moveTo(point.x, point.y);

  switch (e.type) {
    case "mousedown":
      if (e.button == 0) {
        //mouse button left is 0
        setMouseDown(true);
        ctx.beginPath();
      }
      break;
    case "mouseup":
    case "mouseleave":
      setMouseDown(false);
      if (mouseDown) {
        ctx.fillStyle = canvas_settings.stroke_colors[lines.length];
        lines.push(drawPoints);
        ctx.font = canvas_settings.line_number_font;
        ctx.fillText(lines.length + "", point.x, point.y);
        setLines(lines);
        setDrawPoints([]);
        ctx.closePath();
      }
      break;
  }
}

function canvas_draw(
  e: React.MouseEvent<HTMLCanvasElement>,
  mouseDown: boolean,
  drawPoints: Point[],
  setDrawPoints: (drawPoints: Point[]) => void,
  strokeColor: string,
) {
  if (!mouseDown) return;
  const ctx = e.currentTarget.getContext("2d");
  if (!ctx) return;

  const point = findxy(e);
  ctx.strokeStyle = strokeColor;
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  drawPoints.push(point);
  setDrawPoints(drawPoints);
}

function draw_background(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = canvas_settings.background_color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = canvas_settings.background_line_color;
  ctx.setLineDash(canvas_settings.line_dash);
  ctx.lineWidth = canvas_settings.background_line_width;
  ctx.beginPath();
  ctx.moveTo(ctx.canvas.width / 2, 0);
  ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
  ctx.moveTo(0, ctx.canvas.height / 2);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
  ctx.stroke();
  ctx.closePath();
}
export default function KanjiDraw({ kanji, verify_callback }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Point[][]>([]);
  const verify_threshold = 0.05;
  const max_move = 0.1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) return;

    draw_background(context);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <canvas
        width={canvas_settings.width}
        height={canvas_settings.height}
        onMouseDown={(e) =>
          mouseChange(
            e,
            mouseDown,
            setMouseDown,
            drawPoints,
            setDrawPoints,
            lines,
            setLines,
          )
        }
        onMouseUp={(e) =>
          mouseChange(
            e,
            mouseDown,
            setMouseDown,
            drawPoints,
            setDrawPoints,
            lines,
            setLines,
          )
        }
        onMouseLeave={(e) =>
          mouseChange(
            e,
            mouseDown,
            setMouseDown,
            drawPoints,
            setDrawPoints,
            lines,
            setLines,
          )
        }
        onMouseMove={(e) =>
          canvas_draw(
            e,
            mouseDown,
            drawPoints,
            setDrawPoints,
            canvas_settings.stroke_colors[lines.length],
          )
        }
        ref={canvasRef}
      ></canvas>
      <div className="flex gap-1 justify-between">
        <button
          className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center"
          onClick={() =>
            verify_kanji(
              lines,
              kanji,
              canvasRef.current,
              true,
              verify_threshold,
              max_move,
            ).then((r) => verify_callback(r))
          }
        >
          Verify
        </button>
        <button
          className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center"
          onClick={() =>
            clear_canvas(canvasRef.current, setDrawPoints, setLines)
          }
        >
          Clear
        </button>
        <button
          className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center"
          onClick={() =>
            undo_canvas(canvasRef.current, setDrawPoints, lines, setLines)
          }
        >
          Undo
        </button>
        <button
          className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center"
          onClick={() => show_svg_in_canvas(canvasRef.current, kanji)}
        >
          Show Solution
        </button>
      </div>
    </div>
  );
}
