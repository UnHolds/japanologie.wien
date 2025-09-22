"use client";
import React, { useEffect, useRef, useState } from "react";
import { kabsch } from "./kapsch";
interface Props {
  kanji: string;
  verify_callbackAction: (correct: boolean) => void;
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
  background_line_width: 8,
  line_dash: [5, 0],
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
  line_number_font: "40px serif",
};

function findxy(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
): Point {
  const bb = e.currentTarget.getBoundingClientRect();

  let clientX: number;
  let clientY: number;

  if ("touches" in e) {
    // TouchEvent
    const touch = e.touches[0] || e.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    // MouseEvent
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const x = ((clientX - bb.left) / bb.width) * e.currentTarget.width;
  const y = ((clientY - bb.top) / bb.height) * e.currentTarget.height;

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
  max_distance: number, //percent  0-1
  max_translation: number, //percent how far it can correct (0-1)
  max_rotation: number, // degree
  max_scale: number[], //[min, max]
  scale_enable: boolean,
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

  //This is used to interpolate some points on the line
  const lines_interpolated = [];
  const max_interpolate_distance = 5; // if the distance is longer than this px points will be interpolated
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = [];
    line.push(lines[lineIdx][0]);

    for (let pointIdx = 1; pointIdx < lines[lineIdx].length; pointIdx++) {
      const now_p = lines[lineIdx][pointIdx];
      const lst_p = lines[lineIdx][pointIdx - 1];
      const dx = now_p.x - lst_p.x;
      const dy = now_p.y - lst_p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > max_interpolate_distance) {
        const num_interpols = Math.floor(dist / max_interpolate_distance);
        const ndx = dx / dist;
        const ndy = dy / dist;
        for (let i = 0; i < num_interpols; i++) {
          //now interpolate lines
          const new_p = {
            x: lst_p.x + ndx * max_interpolate_distance * i,
            y: lst_p.y + ndy * max_interpolate_distance * i,
          };
          line.push(new_p);
        }
      }
      line.push(now_p);
    }
    lines_interpolated.push(line);
  }

  lines = lines_interpolated;

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
  const scaledPaths = [];

  for (let lineIdx = 0; lineIdx < svg_paths.length; lineIdx++) {
    const path_len = svg_paths[lineIdx].getTotalLength();
    const num_points = lines[lineIdx].length;

    //scale the svg line to the same dimension as the canvas
    const line_point_dist = [];
    for (let i = 1; i < num_points; i++) {
      const dx = lines[lineIdx][i - 1].x - lines[lineIdx][i].x;
      const dy = lines[lineIdx][i - 1].y - lines[lineIdx][i].y;
      line_point_dist.push(Math.sqrt(dx * dx + dy * dy));
    }
    const line_len = line_point_dist.reduce((sum, cur) => sum + cur);
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
    }
    scaledPaths.push(pathPoints);

    //if (debug) {
    //  draw_line(ctx, pathPoints, "#00ffff");
    //}
  }

  const allignedLines = [];
  const corrections = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const { QAligned, R, scale, t } = kabsch(
      scaledPaths[lineIdx].map((e) => [e.x, e.y]),
      lines[lineIdx].map((e) => [e.x, e.y]),
      scale_enable,
    );

    allignedLines.push(QAligned.map((e) => ({ x: e[0], y: e[1] })));

    const translation = Math.sqrt(t[0] * t[0] + t[1] * t[1]);
    const rotation = (Math.atan2(R[1][0], R[0][0]) * 180) / Math.PI;

    corrections.push({
      rotation: Math.abs(rotation),
      translation:
        translation / Math.sqrt(canvas_settings.width * canvas_settings.height),
      scale: scale,
      distance: -1,
    });

    if (debug) {
      draw_line(
        ctx,
        QAligned.map((e) => ({ x: e[0], y: e[1] })),
        "#ffff00",
      );
    }
  }

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const distances = [];
    for (let pointIdx = 0; pointIdx < lines[lineIdx].length; pointIdx++) {
      const ref_point = scaledPaths[lineIdx][pointIdx];
      const draw_point = allignedLines[lineIdx][pointIdx];

      const dx = ref_point.x - draw_point.x;
      const dy = ref_point.y - draw_point.y;

      distances.push(Math.sqrt(dx * dx + dy * dy));
    }

    const avgDistance =
      distances.reduce((sum, cur) => sum + cur) / distances.length;
    corrections[lineIdx].distance =
      avgDistance / Math.sqrt(canvas_settings.width * canvas_settings.height);
  }

  console.log(corrections);

  const rot_scale = 0.1;
  const trans_scale = 0.1;
  const dist_scale = 0.8;

  //TODO better score calc
  for (const cor of corrections) {
    const rot_sim = 1 - cor.rotation / 180;
    const dist_sim = 1 - cor.distance;
    const trans_sim = 1 - cor.translation;

    const sim =
      rot_sim * rot_scale + trans_sim * trans_scale + dist_sim * dist_scale;
    console.log("Sim:" + sim);

    if (cor.rotation > max_rotation) {
      console.log("Rotation to big: " + cor.rotation);
      return false;
    }
    if (cor.translation > max_translation) {
      console.log("translation to big: " + cor.translation);
      return false;
    }
    if (cor.scale < max_scale[0]) {
      console.log("Too much down scale: " + cor.scale);
      return false;
    }
    if (cor.scale > max_scale[1]) {
      console.log("Too much up scale: " + cor.scale);
      return false;
    }

    if (cor.distance > max_distance) {
      console.log("max_distance to big: " + cor.distance);
      return false;
    }

    console.log("Line is okay");
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
  svg_str = svg_str.replace("#000000", "#ffffffaa");
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
    ctx.fillText(i + 1 + "", lines[i][0].x, lines[i][0].y);
  }
  setLines(lines);
}

function mouseChange(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  mouseDown: boolean,
  setMouseDown: (mouseDown: boolean) => void,
  drawPoints: Point[],
  setDrawPoints: (drawPoints: Point[]) => void,
  lines: Point[][],
  setLines: (lines: Point[][]) => void,
) {
  const ctx = e.currentTarget.getContext("2d");
  if (!ctx) return;

  e.preventDefault();

  const point = findxy(e);
  ctx.moveTo(point.x, point.y);
  switch (e.type) {
    case "mousedown":
    case "touchstart":
      if (("button" in e && e.button == 0) || e.type == "touchstart") {
        //mouse button left is 0
        setMouseDown(true);
        ctx.beginPath();
        ctx.fillStyle = canvas_settings.stroke_colors[lines.length];
        ctx.font = canvas_settings.line_number_font;
        ctx.fillText(lines.length + 1 + "", point.x, point.y);
      }
      break;
    case "mouseup":
    case "mouseleave":
    case "touchend":
      setMouseDown(false);
      if (mouseDown) {
        lines.push(drawPoints);
        setLines(lines);
        setDrawPoints([]);
        ctx.closePath();
      }
      break;
  }
}

function canvas_draw(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  mouseDown: boolean,
  drawPoints: Point[],
  setDrawPoints: (drawPoints: Point[]) => void,
  strokeColor: string,
) {
  e.preventDefault();
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
export default function KanjiDraw({ kanji, verify_callbackAction }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Point[][]>([]);

  const max_rotation = 45; //degree
  const max_translation = 0.25;
  const max_scale = [1, 1]; //no scaling allowed
  const max_distance = 0.1;
  const scale_enable = false;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) return;

    clear_canvas(canvasRef.current, setDrawPoints, setLines);
  }, [kanji]);

  return (
    <div className="w-full h-full flex flex-col">
      <canvas
        className="touch-none"
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
        onTouchMove={(e) =>
          canvas_draw(
            e,
            mouseDown,
            drawPoints,
            setDrawPoints,
            canvas_settings.stroke_colors[lines.length],
          )
        }
        onTouchStart={(e) =>
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
        onTouchEnd={(e) =>
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
              max_distance,
              max_translation,
              max_rotation,
              max_scale,
              scale_enable,
            ).then((r) => {
              if (r == false) {
                show_svg_in_canvas(canvasRef.current, kanji);
              }
              verify_callbackAction(r);
            })
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
