

export interface Reading {
    romaji: String,
    katakana: String,
    hiragana: String,
    meaning: String
}

export interface Radical {
    short: String
    long: String|null,
}

export interface Kanji {
    kanji: String,
    main_meaning: String
    radical: Radical,
    number: number
    strokes: number,
    frequency: number,
    book: String,
    section: String,
    on_yomi: Reading[]
    kun_yomi: Reading[]
}

interface Props {
    kanji: Kanji
}

export default function KanjiBox({ kanji }: Props) {
    return (
    <div className="flex border-solid border-2 p-2 relative">
        <div className="w-30">
            <div className="flex text-center h-30 text-8xl justify-center items-center">{kanji.kanji }</div>
            <div className="text-center">{kanji.main_meaning }</div>
        </div>
        <div className="flex flex-col gap-5 ml-5 pt-4">
            <div className="flex">
                <div className="w-25 flex-none"><b>On-yomi:</b></div>
                <div className="flex flex-warp">
                    {kanji.on_yomi.map((reading, i) =>
                        <div key={i}>{ reading.romaji } ({ reading.katakana}) - { reading.meaning }</div>
                    )}
                </div>
            </div>
            <div className="flex">
                <div className="w-25 flex-none"><b>Kun-yomi:</b></div>
                <div className="flex flex-wrap">
                    {kanji.kun_yomi.map((reading, i) =>
                        <div key={i}>{ reading.romaji } ({ reading.hiragana}) - {reading.meaning}</div>
                    )}
                </div>
            </div>

        </div>
        <div className="absolute right-4">{ kanji.number }</div>
    </div>
    );
  }
