"use client"

import { useEffect, useState } from "react";
import { StoryText } from "./honbun";
import { format_furiana } from "@/app/_utils/kanji_utils";


interface Props {
    text: StoryText,
    hide_furigana: boolean
}

export default function HonBunText({ text, hide_furigana }: Props) {

    const [_hideFurigana, _setHideFurigana] = useState(hide_furigana);

        useEffect(() => {
            _setHideFurigana(hide_furigana);
        }, [hide_furigana]);

    return (
        <div className="text-2xl flex gap-6 whitespace-pre">
            <div className={`w-40 flex justify-end ${_hideFurigana ? "" : "pt-2"}`}>
                {format_furiana(text.name, _hideFurigana)}:
            </div>
            <div>
                {format_furiana(text.text, _hideFurigana)}
            </div>
        </div>
    );
  }
