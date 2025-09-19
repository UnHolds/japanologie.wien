"use client";
import React, { useEffect, useRef, useState } from "react";
import { Kanji } from "../../_utils/kanji_type";

interface Props {
  kanji: Kanji;
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
}

const canvas_settings: CanvasSettings = {
  width: 500,
  height: 500,
  background_color: "#aa0000",
  background_line_color: "#00aa00",
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
};

function findxy(e: React.MouseEvent<HTMLCanvasElement>): Point {
  const x = e.clientX - e.currentTarget.offsetLeft;
  const y = e.clientY - e.currentTarget.offsetTop;

  return {
    x: x,
    y: y,
  };
}

function mouseChange(
  e: React.MouseEvent<HTMLCanvasElement>,
  setMouseDown: (mouseDown: boolean) => void,
  drawPoints: Point[],
  setDrawPoints: (drawPoints: Point[]) => void,
  lines: Point[][],
  setLines: (lines: Point[][]) => void,
) {
  const ctx = e.currentTarget.getContext("2d");
  if (!ctx) return;

  switch (e.type) {
    case "mousedown":
      setMouseDown(true);
      ctx.beginPath();
      break;
    case "mouseup":
    case "mouseleave":
      setMouseDown(false);
      lines.push(drawPoints);
      setLines(lines);
      setDrawPoints([]);
      ctx.closePath();
      break;
  }

  const xy = findxy(e);
  ctx.moveTo(xy.x, xy.y);
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
export default function KanjiDraw({ kanji }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Point[][]>([]);
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
    <div className="w-full h-full">
      <canvas
        width={canvas_settings.width}
        height={canvas_settings.height}
        onMouseDown={(e) =>
          mouseChange(
            e,
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
    </div>
  );
}
