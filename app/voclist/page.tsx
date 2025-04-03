"use client"

import { useState } from "react";
import vocs from "../assets/voc.json";
import VocBox from "./_components/voc_box";

export default function VocList() {
    let curr_lesson = -1;
    const [hideKanaKanji, setHideKanaKanji] = useState(false);
    const [hideMeaning, setHideMeaning] = useState(false);
    return (
        <div className="my-10">
            <div className="text-center text-6xl font-bold mb-5">Vokabel-Liste</div>
            <div className="flex justify-center gap-6 mb-5">
                <div className="flex items-center gap-2">
                    <input type="checkbox" name="hide_kana" className="w-5 h-5" checked={hideKanaKanji} onChange={() => {setHideKanaKanji(!hideKanaKanji)}}/>
                    <label htmlFor="hide_kana" className="text-xl">Hide Kana / Kanji</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" name="hide_kanji" className="w-5 h-5" checked={hideMeaning} onChange={() => {setHideMeaning(!hideMeaning)}}/>
                    <label htmlFor="hide_kana" className="text-xl">Hide Meaning</label>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="h-full flex flex-col gap-2 xl:w-1/3 lg:w-2/3">
                    {
                    vocs.map((v, i) => {
                        const elems: React.JSX.Element[] = [];
                        if(curr_lesson != v.lesson) {
                            curr_lesson = v.lesson;
                            elems.push(<div key={`${i}-l`} className="text-center font-bold text-4xl">{curr_lesson} 課</div>);
                            elems.push(<div  key={`${i}-lb`} className="border-t-1"/>);
                        }
                        elems.push(<VocBox key={`${i}-voc`} voc={v} hideKanaKanji={hideKanaKanji} hideMeaning={hideMeaning}/>);
                        elems.push(<div  key={`${i}-b`} className="border-t-1"/>);
                        return elems;
                    })
                    }
                </div>
            </div>
        </div>
    );
  }
