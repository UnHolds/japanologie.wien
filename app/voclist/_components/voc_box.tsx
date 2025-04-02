
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
}


export default function VocBox({ voc }: Props) {
    return (
    <div className="grid grid-cols-3 p-2 relative">
        <div>{voc.kana}</div>
        <div className="text-center">{voc.kanji}</div>
        <div className="text-right">{voc.meaning}</div>
    </div>
    )
}
