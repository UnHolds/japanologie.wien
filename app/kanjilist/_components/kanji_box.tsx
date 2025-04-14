import { Kanji } from "@/app/_utils/kanji_type";
import { useEffect, useState } from "react"

interface Props {
    kanji: Kanji
    hideInfo: boolean
}

export default function KanjiBox({ kanji, hideInfo }: Props) {

    const [_hideInfo, _setHideInfo] = useState(hideInfo);

    useEffect(() => {
        _setHideInfo(hideInfo);
    }, [hideInfo]);

    return (
    <div className="flex border-solid border-2 p-2 relative group" onClick={() => _setHideInfo(!_hideInfo && hideInfo)}>
        <div className="w-30">
            <div className="flex text-center h-30 text-8xl justify-center items-center">{kanji.kanji }</div>
            <div className={`text-center ${_hideInfo ? "bg-gray-100 blur-lg group-hover:bg-inherit group-hover:blur-none" : ""}`}>{kanji.main_meaning }</div>
        </div>
        <div className="flex flex-col gap-5 ml-5 pt-4">
            <div className="flex">
                <div className="w-25 flex-none"><b>On-yomi:</b></div>
                <div className="flex flex-warp flex-col sm:flex-row gap-2">
                    {kanji.on_yomi.map((reading, i) =>
                        <div key={i} className={`${_hideInfo ? "bg-gray-100 blur-lg group-hover:bg-inherit group-hover:blur-none" : ""}`}>{ reading.romaji } ({ reading.katakana}) - { reading.meaning }</div>
                    )}
                </div>
            </div>
            <div className="flex">
                <div className="w-25 flex-none"><b>Kun-yomi:</b></div>
                <div className="flex flex-wrap flex-col sm:flex-row gap-2">
                    {kanji.kun_yomi.map((reading, i) =>
                        <div key={i} className={`${_hideInfo ? "bg-gray-100 blur-lg group-hover:bg-inherit group-hover:blur-none" : ""}`}>{ reading.romaji } ({ reading.hiragana}) - {reading.meaning}</div>
                    )}
                </div>
            </div>

        </div>
        <div className="absolute right-4">{ kanji.number }</div>
    </div>
    );
  }
