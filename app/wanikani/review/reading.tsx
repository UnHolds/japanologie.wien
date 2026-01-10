import { useState } from "react";
import {
  KanjiReadingObject,
  SubjectKanji,
  SubjectVocabulary,
  VocabularyReadingObject,
} from "../_api/subject";
import { toast } from "react-toastify";
import { toKana, isKana } from "wanakana";
interface Props {
  subject: SubjectKanji | SubjectVocabulary;
  reportResult: (correct: boolean) => void;
}

function check(
  actual: string,
  expected: VocabularyReadingObject[] | KanjiReadingObject[],
  reportResult: (correct: boolean) => void,
) {
  if (isKana(actual) == false) {
    return;
  }
  expected.forEach((reading) => {
    if (reading.reading == actual) {
      if (reading.accepted_answer == true) {
        reportResult(true);
        return;
      } else {
        toast.info("This is possible, but not the right answer");
      }
    }
  });
  reportResult(false);
}

export default function Reading({ subject, reportResult }: Props) {
  const [input, setInput] = useState<string>("");
  return (
    <div>
      <div className="text-3xl font-bold text-center">Reading</div>
      <div className="text-6xl text-center">{subject.characters}</div>
      <div className="w-full px-5 ">
        <input
          className="bg-white h-10 w-full text-black"
          onKeyDown={(e) =>
            e.key == "Enter" && check(input, subject.readings, reportResult)
          }
          value={input}
          onChange={(e) => setInput(toKana(e.target.value))}
        />
      </div>
    </div>
  );
}
