
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

    return (
    <div className="grid grid-cols-3 p-2 relative">
        <div className="group">
            <div className={`w-fit ${hideKanaKanji ? "blur-lg bg-gray-100 group-hover:blur-none group-hover:bg-inherit" : ""}`}>{voc.kana}</div>
        </div>
        <div className="flex justify-center group">
            <div className={`w-fit ${hideKanaKanji ? "blur-lg bg-gray-100 group-hover:blur-none group-hover:bg-inherit" : ""}`}>{voc.kanji}</div>
        </div>
        <div className="flex justify-end group">
            <div className={`w-fit ${hideMeaning ? "blur-lg bg-gray-100 group-hover:blur-none group-hover:bg-inherit" : ""}`}>{voc.meaning}</div>
        </div>
    </div>
    )
}
