import { Kanji } from "@/app/_utils/kanji_type";
import { useEffect, useRef } from "react";
import { QuestionType } from "../page";
import kanjis from "../../../assets/kanji.json"
import { toast } from "react-toastify";
import KanjiQuestionTypeSelect from "./kanji_questionTypes";

interface Props {
    setKanjiList: ((kl: Kanji[]) => void),
    setQuestionTypes: ((qt: QuestionType) => void)
}


export default function KanjiCustomSettings({ setKanjiList, setQuestionTypes}: Props) {

    const textRef = useRef<null|HTMLInputElement>(null)

    useEffect(() => {
        setKanjiList([])
    }, [setKanjiList]);

    const loadKanji = () => {
        const val = textRef.current?.value;
        if(val == undefined){
            return
        }
        const kanji_list = kanjis.filter((k) => val.includes(k.kanji));
        toast.info("Found " + kanji_list.length + " out of " + val.length + " kanjis");

        if(textRef.current != null){
            textRef.current.value = "";
        }

        setKanjiList(kanji_list)
    }

    return (
        <div>
            <div className="flex justify-center gap-6 mb-5">
                <input ref={textRef} type="text" className="bg-white text-black" />
                <button className="flex bg-sky-700 p-2 rounded md:text-xl text-lg font-bold items-center" onClick={loadKanji}>Load</button>
            </div>
            <KanjiQuestionTypeSelect setQuestionTypes={setQuestionTypes}/>
        </div>
    );
}
