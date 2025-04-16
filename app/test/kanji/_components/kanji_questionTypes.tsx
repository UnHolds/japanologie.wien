import { useEffect, useState } from "react"
import { QuestionType } from "../page"

interface Props {
    setQuestionTypes: ((qt: QuestionType) => void)
}


export default function KanjiQuestionTypeSelect({ setQuestionTypes}: Props) {

    const [draw, setDraw] = useState<boolean>(true)

    useEffect(() => {
        setQuestionTypes({
            draw: draw
        });
    }, [setQuestionTypes, draw])

    return (
        <div className="flex justify-center gap-6 mb-5 md:flex-row flex-col items-center">
            <div className="flex items-center gap-2">
                <input type="checkbox" id="draw" className="w-5 h-5" checked={draw} onChange={() => {setDraw(!draw)}}/>
                <label htmlFor="draw" className="text-xl">Draw</label>
            </div>
        </div>
    )
}
