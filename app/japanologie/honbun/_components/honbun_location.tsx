"use client"

import { useEffect, useState } from "react";
import { StoryLocation } from "./honbun";
import { format_furiana } from "@/app/_utils/kanji_utils";

interface Props {
    location: StoryLocation,
    hide_furigana: boolean,
    hide_translation: boolean
}

export default function HonBunLocation({ location, hide_furigana, hide_translation }: Props) {

    const [_hideFurigana, _setHideFurigana] = useState(hide_furigana);
    const [_hideTranslation, _setHideTranslation] = useState(hide_translation);

    useEffect(() => {
        _setHideFurigana(hide_furigana);
        _setHideTranslation(hide_translation);
    }, [hide_furigana, hide_translation]);

    return (
        <div>
            <div className="text-2xl w-fit text-end">
                ({format_furiana(location.location, _hideFurigana)})
            </div>
            { _hideTranslation == false &&
            <div className="text-2xl w-fit text-end">
                ({location.translation})
            </div>}
        </div>
    );
  }
