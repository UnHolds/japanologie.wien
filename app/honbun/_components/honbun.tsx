"use client"

import { format_furiana } from "@/app/_utils/kanji_utils"
import HonBunLocation from "./honbun_location"
import HonBunText from "./honbun_text"
import { useEffect, useState } from "react"

export type StoryLine = StoryLocation | StoryText

export interface StoryLocation {
    location: string
}

export interface StoryText {
    name: string,
    text: string
}

export interface Story {
    lesson: number,
    honbun: number,
    title: string,
    story: StoryLine[]
}

interface Props {
    honbun: Story,
    hide_furigana: boolean
}

export default function HonBun({ honbun, hide_furigana }: Props) {

    const [_hideFurigana, _setHideFurigana] = useState(hide_furigana);

    useEffect(() => {
        _setHideFurigana(hide_furigana);
    }, [hide_furigana]);

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col gap-3">
                <div className="text-4xl font-bold mb-8 text-center">{`[${honbun.lesson}.${honbun.honbun}] - `} {format_furiana(honbun.title, _hideFurigana)}</div>
                {honbun.story.map((sl, i) => {
                    if ((sl as StoryLocation).location) {
                        return <HonBunLocation key={i} location={sl as StoryLocation} hide_furigana={_hideFurigana}/>
                    }else{
                        //shoule be storyline
                        return <HonBunText key={i} text={sl as StoryText} hide_furigana={_hideFurigana}/>
                    }
                })}
            </div>
        </div>
    );
  }
