"use client"
import { useEffect, useState } from "react";
import KanjiDraw from "./_components/kanji_draw";

import { Kanji } from "@/app/_utils/kanji_type"
import KanjiCustomSettings from "./_components/kanji_custom_settings";
import KanjiListSettings from "./_components/kanji_list_settings";

export interface QuestionType {
    draw: boolean
}

enum QuestionTypeEnum {
    DRAW,
    DONE
}

export default function KanjiTest() {

    const [questionTypes, setQuestionTypes] = useState<QuestionType>({draw: true});
    const [kanji, setKanji] = useState<Kanji| undefined>(undefined);
    const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
    const [currentList, setCurrentList] = useState<{k: Kanji, qt: QuestionType}[]>([])
    const [currentQuestionType, setCurrentQuestionType] = useState<QuestionTypeEnum>(QuestionTypeEnum.DRAW)

    const [type, setType] = useState("list_draw");

    useEffect(() => {
        const new_cur = kanjiList.map(k => {
            return {
                k: k,
                qt: {
                    draw: !questionTypes.draw // will be set to true if not used (marked as done)
                }
            }
        });
        setCurrentList(new_cur);
        get_kanji(new_cur);
    }, [kanjiList])

    function get_kanji(list: {k: Kanji, qt: QuestionType}[]) {

        if(list.length == 0){
            setCurrentQuestionType(QuestionTypeEnum.DONE);
            return;
        }

        const {k, qt} = list[Math.floor(Math.random()*list.length)]
        setKanji(k)
        const options = Object.entries(qt).filter(v => v[1] == false)
        const option = options[Math.floor(Math.random()*options.length)][0]

        //TODO add new question types
        if(option == "draw"){
            setCurrentQuestionType(QuestionTypeEnum.DRAW);
        }

    }

    function correct() {
        const {k, qt} = currentList.filter(({k, qt}) => k == kanji)[0];
        //TODO add new question types
        if(currentQuestionType == QuestionTypeEnum.DRAW){
            qt.draw = true;
        }

        const new_list = currentList.filter(({k, qt}) => k != kanji);
        if(Object.entries(qt).filter(v => v[1] == false).length != 0){
            new_list.push({k: k, qt: qt})
        }
        get_kanji(new_list)
        setCurrentList(new_list)
    }

    function wrong() {
        get_kanji(currentList)
    }



    let handleOptionChange = (changeEvent: any) => {
        setType(changeEvent.target.value);
    };



    return (
        <div>
            <div>
                <div className="text-center text-6xl font-bold my-5">Kanji-Test</div>
                <div className="text-center text-2xl font-bold mb-2">Settings</div>
                <div className="flex justify-center gap-6 mb-5">
                    <div className="flex items-center gap-2">
                        <input type="radio" value="list_draw" id="rb1" name="testtype" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={type == "list_draw"} onChange={handleOptionChange}/>
                        <label htmlFor="rb1" className="text-xl text-center1">Kanji List Draw</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="radio" value="custom_draw" id="rb2" name="testtype" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={type == "custom_draw"} onChange={handleOptionChange}/>
                        <label htmlFor="rb2" className="text-xl text-center1">Kanji Custom Draw</label>
                    </div>
                </div>
                {
                    (() => {
                        if(type == "list_draw") {
                            return <KanjiListSettings setKanjiList={setKanjiList} setQuestionTypes={setQuestionTypes}/>
                        }else if(type == "custom_draw"){
                            return <KanjiCustomSettings setKanjiList={setKanjiList} setQuestionTypes={setQuestionTypes}/>
                        }else{
                            return <div></div>
                        }
                    })()
                }
                <div className="flex justify-center gap-6 mb-5 text-xl font-bold">Items left: {currentList.length}</div>
            </div>
            <div className="flex justify-center mt-10">
                {currentQuestionType == QuestionTypeEnum.DRAW && kanji && <KanjiDraw kanji={kanji.kanji} name={kanji.main_meaning}/>}
                {currentQuestionType == QuestionTypeEnum.DONE && <div className="text-4xl font-bold">ALL DONE</div>}
            </div>
            <div className="flex gap-5 justify-center w-full mt-20">
                <button className="flex bg-rose-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={wrong}>Wrong</button>
                <button className="flex bg-emerald-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={correct}>Correct</button>
            </div>

        </div>
    );
  }
