"use client"

import { useEffect, useState } from "react";
import { StoryLocation } from "./honbun";
import { format_furiana } from "@/app/_utils/kanji_utils";

interface Props {
    location: StoryLocation,
    hide_furigana: boolean
}

export default function HonBunLocation({ location, hide_furigana }: Props) {

    const [_hideFurigana, _setHideFurigana] = useState(hide_furigana);

    useEffect(() => {
        _setHideFurigana(hide_furigana);
    }, [hide_furigana]);

    return (
        <div className="text-2xl w-40 text-end">
            ({format_furiana(location.location, _hideFurigana)})
        </div>
    );
  }
