import KanjiDraw from "@/app/_components/kanji_draw/kanji_draw";
import {
  SubjectKanaVocabulary,
  SubjectKanji,
  SubjectRadical,
  SubjectVocabulary,
} from "../_api/subject";
import { useState } from "react";

interface Props {
  subject:
    | SubjectRadical
    | SubjectKanji
    | SubjectVocabulary
    | SubjectKanaVocabulary;
  reportResult: (correct: boolean) => void;
  continue_review: () => void;
}

export default function Writing({
  subject,
  reportResult,
  continue_review,
}: Props) {
  const [showNextButton, setShowNextButton] = useState(false);
  return (
    <div>
      <div className="text-3xl text-center">
        {subject.meanings.find((e) => e.primary)?.meaning || "Not found"}
      </div>
      <KanjiDraw
        kanji={subject.characters || "不"}
        verify_callbackAction={(correct) => {
          reportResult(correct);
          setShowNextButton(correct == false);
        }}
      />
      {showNextButton && (
        <div className="flex justify-center">
          <button
            autoFocus
            className="flex bg-red-500 m-2 p-2 rounded md:text-2xl text-xl font-bold items-center"
            onClick={continue_review}
          >
            Wrong - Next
          </button>
        </div>
      )}
    </div>
  );
}
