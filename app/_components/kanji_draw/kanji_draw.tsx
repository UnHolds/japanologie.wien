"use client";
import React, {
  EventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
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
}

const canvas_settings: CanvasSettings = {
  width: 500,
  height: 500,
  background_color: "#aa0000",
  background_line_color: "#00aa00",
  background_line_width: 3,
  line_dash: [5, 3],
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
  setDrawPoints: (drawPoints: Point[]) => void,
) {
  switch (e.type) {
    case "mousedown":
      setMouseDown(true);
      break;
    case "mouseup":
    case "mouseleave":
      setMouseDown(false);
      setDrawPoints([]);
      break;
  }

  const ctx = e.currentTarget.getContext("2d");
  if (!ctx) return;

  const xy = findxy(e);
  ctx.moveTo(xy.x, xy.y);
}

function canvas_draw(
  e: React.MouseEvent<HTMLCanvasElement>,
  mouseDown: boolean,
  drawPoints: Point[],
  setDrawPoints: (drawPoints: Point[]) => void,
) {
  if (!mouseDown) return;
  const ctx = e.currentTarget.getContext("2d");
  if (!ctx) return;

  const point = findxy(e);
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
}
export default function KanjiDraw({ kanji }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
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
        onMouseDown={(e) => mouseChange(e, setMouseDown, setDrawPoints)}
        onMouseUp={(e) => mouseChange(e, setMouseDown, setDrawPoints)}
        onMouseLeave={(e) => mouseChange(e, setMouseDown, setDrawPoints)}
        onMouseMove={(e) =>
          canvas_draw(e, mouseDown, drawPoints, setDrawPoints)
        }
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
