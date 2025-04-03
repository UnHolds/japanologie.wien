"use client"

import KanjiBox from "./_components/kanji_box";

import kanjis from "../assets/kanji.json";
import { useState } from "react";

export default function KanjiList() {

    const [hideInfo, setHideInfo] = useState(false);

    return (
        <div className="my-10">
            <div className="text-center text-6xl font-bold mb-5">Kanji-Liste</div>
            <div className="flex justify-center gap-6 mb-5">
                <div className="flex items-center gap-2">
                    <input type="checkbox" name="hide_info" className="w-5 h-5" checked={hideInfo} onChange={() => {setHideInfo(!hideInfo)}}/>
                    <label htmlFor="hide_info" className="text-xl">Hide Info</label>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="h-full flex flex-col gap-6 xl:w-1/3 lg:w-2/3">
                    {kanjis.map((k, i) => <KanjiBox key={i} kanji={k} hideInfo={hideInfo}/>)}
                </div>
            </div>
        </div>
    );
  }
