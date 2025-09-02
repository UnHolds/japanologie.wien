"use client"

import { format_furiana } from "@/app/_utils/kanji_utils"
import HonBunLocation from "./honbun_location"
import HonBunText from "./honbun_text"
import { useEffect, useState } from "react"

export type StoryLine = StoryLocation | StoryText

export interface StoryLocation {
    location: string
    translation: string
}

export interface StoryText {
    name: string,
    text: string,
    translation: string
}

export interface Story {
    lesson: number,
    honbun: number,
    title: string,
    title_translation: string,
    story: StoryLine[]
}

interface Props {
    honbun: Story,
    hide_furigana: boolean,
    hide_translation: boolean,
    className?: string
}

export default function HonBun({ honbun, hide_furigana, hide_translation, className }: Props) {

    const [_hideFurigana, _setHideFurigana] = useState(hide_furigana);
    const [_hideTranslation, _setHideTranslation] = useState(hide_translation);

    useEffect(() => {
        _setHideFurigana(hide_furigana);
        _setHideTranslation(hide_translation);
    }, [hide_furigana, hide_translation]);

    return (
        <div className={`flex justify-center ${className}`}>
            <div className="flex flex-col gap-3">
                <div className="text-4xl font-bold mb-8 text-center">{`[${honbun.lesson}.${honbun.honbun}] - `} {format_furiana(honbun.title, _hideFurigana)}</div>
                {honbun.story.map((sl, i) => {
                    if ((sl as StoryLocation).location) {
                        return <HonBunLocation key={i} location={sl as StoryLocation} hide_furigana={_hideFurigana} hide_translation={_hideTranslation} />
                    }else{
                        //shoule be storyline
                        return <HonBunText key={i} text={sl as StoryText} hide_furigana={_hideFurigana} hide_translation={_hideTranslation}/>
                    }
                })}
            </div>
        </div>
    );
  }
