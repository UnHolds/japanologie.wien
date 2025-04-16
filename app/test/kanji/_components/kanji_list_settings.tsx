"use client"
import { Kanji } from "@/app/_utils/kanji_type";
import { useEffect, useState } from "react";
import kanjis from "../../../assets/kanji.json"
import { QuestionType } from "../page";

interface Props {
    setKanjiList: ((kl: Kanji[]) => void),
    setQuestionTypes: ((qt: QuestionType) => void)
}

export default function KanjiListSettings({ setKanjiList, setQuestionTypes}: Props) {

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(300);

    //TODO handle question type

    useEffect(() => {
        setKanjiList(kanjis.slice(start, end + 1));
    }, [start, end, setKanjiList])

    return (
        <div className="flex justify-center gap-6 mb-5">
            <div className="flex items-center gap-2">
                <input type="number" name="kanji_num" className="w-17 h-5 bg-white text-black" min={0} max={end} value={start} onChange={(e) => setStart(Number(e.target.value))}/>
                <label htmlFor="kanji_num" className="text-xl">Start Nr</label>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" name="kanji_num" className="w-17 h-5 bg-white text-black" min={start} max={kanjis.length} value={end} onChange={(e) => setEnd(Number(e.target.value))}/>
                <label htmlFor="kanji_num" className="text-xl">End Nr</label>
            </div>
        </div>
    );
}
