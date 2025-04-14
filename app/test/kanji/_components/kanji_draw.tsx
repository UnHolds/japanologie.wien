"use client"


import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";

interface Props {
    kanji: string,
    name: string,
    height?: number,
    width?: number,
    color?: string
}

function clearCanvas(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const canvas = canvasRef.current;
    if(canvas == null){
        return
    }
    const ctx = canvas.getContext('2d')

    if(ctx == null){
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


export default function KanjiDraw({ kanji, name, height = 200, width = 200, color = '#04ebfb' } : Props) {
    const kanji_svg_url = "/kanji_svg/" + kanji.charCodeAt(0).toString(16).padStart(5, '0') + '.svg'

    const canvasRef = useRef<null|HTMLCanvasElement>(null)
    var pos = { x: 0, y: 0 };

    const [show, setShow] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas == null){
            return
        }
        const ctx = canvas.getContext('2d')

        if(ctx == null){
            return
        }

        window.addEventListener('resize', () => {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        });

        canvas.addEventListener("mousemove", (e) => {
            if (e.buttons !== 1) return;
            ctx.beginPath(); // begin

            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
            ctx.moveTo(pos.x, pos.y);
            pos.x = e.clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0);
            pos.y = e.clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0);
            ctx.lineTo(pos.x, pos.y); // to
            ctx.stroke(); // draw it!
        })

        document.addEventListener('mousedown', (e) => {
            pos.x = e.clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0);
            pos.y = e.clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0);
        });
        document.addEventListener('mouseenter', (e) => {
            pos.x = e.clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0);
            pos.y = e.clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0);
        });

    }, [canvasRef.current])


    return (
        //https://www.npmjs.com/package/react-canvas-draw
        <div className="size-fit">
            <div className="text-center text-3xl font-bold mb-3">{name}</div>
            <div className="relative border-3 size-fit">
                <canvas ref={canvasRef} className={`z-10 absolute top-0 ${show ? "opacity-80" : "opacity-100"}`} width={width} height={height} />
                <Image src={kanji_svg_url} alt="Kanji SVG" width={width} height={height} className={`dark:invert ${show ? "opacity-100" : "opacity-0"}`} />
            </div>
            <div className="flex justify-around  mt-3">
                <button className="bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center" onClick={() => clearCanvas(canvasRef)}>Clear</button>
                <button className="bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </div>
        </div>
    );
  }
