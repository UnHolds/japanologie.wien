"use client"
import HonBun from "./_components/honbun";

import honbuns from "../assets/honbun.json";
import { format_furiana } from "../_utils/kanji_utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function HonBunPage() {

    const [toShowHonbunId, setToShowHonbunId] = useState(1);

    const [hideFurigana, setHideFurigana] = useState(false);
    const [hideTranslation, setHideTranslation] = useState(true);
    //
    return (
        <div className="pt-8 h-full">
            <div className="text-6xl font-bold text-center mb-10">{format_furiana("{本|ほん}{文|ぶん}", false)} - HonBun</div>
            <div className="text-center mb-10">This page needs a lot of help, pls submit the missing honbuns</div>
            <div className="flex justify-center gap-6 mb-5">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="hide_furigana" className="w-5 h-5" checked={hideFurigana} onChange={() => {setHideFurigana(!hideFurigana)}}/>
                    <label htmlFor="hide_furigana" className="text-xl">Hide Furigana</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="hide_meaning" className="w-5 h-5" checked={hideTranslation} onChange={() => {setHideTranslation(!hideTranslation)}}/>
                    <label htmlFor="hide_meaning" className="text-xl">Hide Translation</label>
                </div>
            </div>
            <div className="flex flex-col items-center gap-6">
                {honbuns.map((h,i) => {
                    return <div className="w-1/2" key={i}>

                        <button className="bg-blue-500 p-2 rounded w-full flex items-center justify-between" onClick={() => {setToShowHonbunId(i == toShowHonbunId ? -1 : i)}}>
                            {toShowHonbunId == i ? <FontAwesomeIcon icon={faCaretDown} size="3x" className="ml-2"/> : <FontAwesomeIcon icon={faCaretRight} size="3x" className="ml-2"/>}
                            <div className="text-2xl ">
                                [{h.lesson}.{h.honbun}] - {format_furiana(h.title, hideFurigana)} {hideTranslation ? "" : `(${h.title_translation})`}
                            </div>
                            <div/>
                        </button>
                        {toShowHonbunId == i && <HonBun className="my-8" honbun={h} hide_furigana={hideFurigana} hide_translation={hideTranslation}/>}
                    </div>
                })}
            </div>
        </div>
    );
  }
