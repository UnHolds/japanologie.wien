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

    const [show, setShow] = useState(false);
    const [_kanji, _setKanji] = useState(kanji);
    const pos = useRef({ x: 0, y: 0 })
    const [init, setInit] = useState(false);

    const [hw, setHW] = useState({h: height, w: width});
    const [scale, setScale] = useState(1.0);


    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas == null){
            return
        }
        const ctx = canvas.getContext('2d')

        if(ctx == null){
            return
        }

        ctx.canvas.width = width * scale;
        ctx.canvas.height = height * scale;
        setHW({h: height, w: width})
    }, [height, width, scale])

    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas == null){
            return
        }
        const ctx = canvas.getContext('2d')

        if(ctx == null){
            return
        }

        if(kanji != _kanji){
            clearCanvas(canvasRef);
            setShow(false);
            _setKanji(kanji);
        }


        if(init == false){

            canvas.addEventListener("mousemove", (e) => {
                if (e.buttons !== 1) return;
                ctx.beginPath(); // begin

                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.strokeStyle = color;
                ctx.moveTo(pos.current.x, pos.current.y);
                pos.current = {x: e.clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0), y: e.clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0) + window.scrollY}
                ctx.lineTo(pos.current.x, pos.current.y); // to
                ctx.stroke(); // draw it!
            })

            canvas.addEventListener("touchstart", function (e) {
                if (e.target == canvas) {
                    e.preventDefault();
                }
                pos.current = {x: e.touches[0].clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0), y: e.touches[0].clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0) + window.scrollY}
            }, false);

            canvas.addEventListener("touchmove", function (e) {
                if (e.target == canvas) {
                    e.preventDefault();
                }
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    buttons: 1
                });
                canvas.dispatchEvent(mouseEvent);
            }, false);


            document.addEventListener('mousedown', (e) => {
                pos.current = {x: e.clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0), y: e.clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0) + window.scrollY}
            });
            document.addEventListener('mouseenter', (e) => {
                pos.current = {x: e.clientX - canvas.offsetLeft - (canvas.parentElement?.offsetLeft || 0), y: e.clientY - canvas.offsetTop - (canvas.parentElement?.offsetTop || 0) + window.scrollY}
            });
            setInit(true);

        }

    }, [kanji, _kanji, color, pos, init, width, height])


    return (
        //https://www.npmjs.com/package/react-canvas-draw
        <div className="size-fit">
            <div className="text-center text-3xl font-bold mb-3">{name}</div>
            <div className="relative border-3 size-fit">
                <canvas ref={canvasRef} className={`z-10 absolute top-0 ${show ? "opacity-80" : "opacity-100"}`} width={hw.w * scale} height={hw.h * scale} />
                <Image src={kanji_svg_url} alt="Kanji SVG" width={hw.w * scale} height={hw.h * scale} className={`dark:invert ${show ? "opacity-100" : "opacity-0"}`} />
            </div>

            <div className="flex justify-around mt-3 gap-2">
                <button className="bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center w-10" onClick={() => setScale(window.innerWidth >= hw.w * (scale + 0.1) ? scale + 0.1 : scale)}>+</button>
                <button className="bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center w-10" onClick={() => setScale(scale == 0.1 ? 0.1 : scale - 0.1)}>-</button>
                <button className="bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center" onClick={() => clearCanvas(canvasRef)}>Clear</button>
                <button className="bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center" onClick={() => {
                    setShow(!show)
                    }}>{show ? "Hide" : "Show"}</button>
            </div>
        </div>
    );
  }
