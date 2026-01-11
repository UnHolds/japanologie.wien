import { useState } from "react";
import {
  Meaning as Meaning_,
  SubjectKanaVocabulary,
  SubjectKanji,
  SubjectRadical,
  SubjectVocabulary,
} from "../_api/subject";
import { toast } from "react-toastify";

interface Props {
  subject:
    | SubjectRadical
    | SubjectKanji
    | SubjectVocabulary
    | SubjectKanaVocabulary;
  reportResult: (correct: boolean) => void;
}

function isTheSame(actual: string, expected: string): boolean {
  return actual.toLowerCase() == expected.toLowerCase();
}

function check(
  actual: string,
  expected: Meaning_[],
  reportResult: (correct: boolean) => void,
) {
  for (const meaning of expected) {
    if (isTheSame(actual, meaning.meaning)) {
      if (meaning.accepted_answer == true) {
        reportResult(true);
        return;
      } else {
        toast.info("This is possible, but not the right answer");
      }
    }
  }
  reportResult(false);
}

export default function Meaning({ subject, reportResult }: Props) {
  const [input, setInput] = useState<string>("");
  return (
    <div>
      <div className="h-100 flex flex-col">
        <div className="text-3xl font-bold text-center">Meaning</div>
        <div className="text-8xl text-center grow flex items-center justify-center">
          {subject.characters}
        </div>
      </div>

      <div className="w-full px-5 ">
        <input
          autoFocus
          className="bg-white h-10 w-full text-black"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              check(input, subject.meanings, reportResult);
              setInput("");
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
}
