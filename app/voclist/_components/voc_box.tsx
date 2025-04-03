import { useEffect, useState } from "react";

export interface Voc {
    lesson: number,
    kana: string,
    kana_furigana?: string,
    kanji?: string,
    kanji_furigana?: string,
    meaning: string
}

interface Props {
    voc: Voc
    hideKanaKanji: boolean,
    hideMeaning: boolean
}


export default function VocBox({ voc, hideKanaKanji, hideMeaning }: Props) {

    const [_hideKanaKanji, _setHideKanaKanji] = useState(hideKanaKanji);
    const [_hideMeaning, _setHideMeaning] = useState(hideMeaning);

    useEffect(() => {
        _setHideKanaKanji(hideKanaKanji);
        _setHideMeaning(hideMeaning);
    }, [hideKanaKanji, hideMeaning]);

    return (
    <div className="grid grid-cols-3 p-2 relative">
        <div className="group" onClick={() => {_setHideKanaKanji(!_hideKanaKanji && hideKanaKanji)}}>
            <div className={`w-fit ${_hideKanaKanji ? "blur-lg bg-gray-100 group-hover:blur-none group-hover:bg-inherit" : ""}`}>{voc.kana}</div>
        </div>
        <div className="flex justify-center group" onClick={() => {_setHideKanaKanji(!_hideKanaKanji && hideKanaKanji)}}>
            <div className={`w-fit ${_hideKanaKanji ? "blur-lg bg-gray-100 group-hover:blur-none group-hover:bg-inherit" : ""}`}>{voc.kanji}</div>
        </div>
        <div className="flex justify-end group" onClick={() => {_setHideMeaning(!_hideMeaning && hideMeaning)}}>
            <div className={`w-fit ${_hideMeaning ? "blur-lg bg-gray-100 group-hover:blur-none group-hover:bg-inherit" : ""}`}>{voc.meaning}</div>
        </div>
    </div>
    )
}
