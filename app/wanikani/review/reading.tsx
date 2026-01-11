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

  for (const reading of expected) {
    if (reading.reading == actual) {
      if (reading.accepted_answer == true) {
        reportResult(true);
        return;
      } else {
        toast.info("This is possible, but not the right answer");
      }
    }
  }
  reportResult(false);
}

function toKanaLive(input: string): string {
  if (input.at(-1) == "n" && input.at(-2) != "n") {
    return input;
  }

  if (input.at(-1) == "n" && input.at(-2) == "n") {
    input = input.substring(0, input.length - 1);
  }
  return toKana(input);
}

export default function Reading({ subject, reportResult }: Props) {
  const [input, setInput] = useState<string>("");
  return (
    <div>
      <div className="h-100 flex flex-col">
        <div className="text-3xl font-bold text-center">Reading</div>
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
              check(toKana(input), subject.readings, reportResult);
              setInput("");
            }
          }}
          value={input}
          onChange={(e) => setInput(toKanaLive(e.target.value))}
        />
      </div>
    </div>
  );
}
