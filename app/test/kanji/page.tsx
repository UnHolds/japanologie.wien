"use client"
import { useState } from "react";
import KanjiDraw from "./_components/kanji_draw";
import kanjis from "../../assets/kanji.json"
import { Kanji } from "@/app/_utils/kanji_type"



export default function KanjiTest() {

    const [draw, setDraw] = useState(true);
    const [kanji, setKanji] = useState<Kanji>(kanjis[0]);
    const [maxBound, setMaxBound] = useState(300);

    function get_kanji() {
        const bound = maxBound > kanjis.length ? kanjis.length : maxBound;
        setKanji(kanjis[Math.floor(Math.random()*bound)])
    }

    function skip() {
        get_kanji()
    }

    function correct() {
        get_kanji()
    }

    function wrong() {
        get_kanji()
    }

    return (
        <div>
            <div>
                <div className="text-center text-6xl font-bold my-5">Kanji-Test</div>
                <div className="text-center text-2xl font-bold mb-2">Settings</div>
                <div className="flex justify-center gap-6 mb-5">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="draw_kanji" className="w-5 h-5" checked={draw} onChange={() => {setDraw(!draw)}}/>
                        <label htmlFor="draw_kanji" className="text-xl">Drawing Kanji (does nothing)</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" name="kanji_num" className="w-17 h-5 bg-white text-black" min={0} value={maxBound} onChange={(e) => setMaxBound(Number(e.target.value))}/>
                        <label htmlFor="kanji_num" className="text-xl">Max Kanji Nr</label>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-10">
                <KanjiDraw kanji={kanji.kanji} name={kanji.main_meaning}/>
            </div>
            <div className="flex gap-5 justify-center w-full mt-20">
                <button className="flex bg-emerald-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={correct}>Correct</button>
                <button className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={skip}>Skip</button>
                <button className="flex bg-rose-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={wrong}>Wrong</button>
            </div>

        </div>
    );
  }
