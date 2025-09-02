"use client"

import { useEffect, useState } from "react";
import { StoryText } from "./honbun";
import { format_furiana } from "@/app/_utils/kanji_utils";


interface Props {
    text: StoryText,
    hide_furigana: boolean,
    hide_translation: boolean
}

export default function HonBunText({ text, hide_furigana, hide_translation }: Props) {

    const [_hideFurigana, _setHideFurigana] = useState(hide_furigana);
    const [_hideTranslation, _setHideTranslation] = useState(hide_translation);

    useEffect(() => {
        _setHideFurigana(hide_furigana);
        _setHideTranslation(hide_translation);
    }, [hide_furigana, hide_translation]);

    return (
        <div>
            <div className="text-2xl flex gap-6 whitespace-pre">
                <div className={`w-40 flex justify-end ${_hideFurigana ? "" : "pt-2"}`}>
                    {format_furiana(text.name, _hideFurigana)}:
                </div>
                <div>
                    {format_furiana(text.text, _hideFurigana)}
                </div>
            </div>
            {_hideTranslation == false &&
                <div className="text-2xl flex gap-6 whitespace-pre">
                    <div className={`w-40 flex justify-end ${_hideFurigana ? "" : "pt-2"}`}/>
                    <div>
                        {text.translation}
                    </div>
                </div>
            }
        </div>
    );
  }
