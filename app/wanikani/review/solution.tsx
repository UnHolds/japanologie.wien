import {
  SubjectRadical,
  SubjectKanji,
  SubjectVocabulary,
  SubjectKanaVocabulary,
} from "../_api/subject";
import { ReviewType } from "./page";

interface Props {
  continue_reviews: () => void;
  reviewType: ReviewType;
  subject:
    | SubjectRadical
    | SubjectKanji
    | SubjectVocabulary
    | SubjectKanaVocabulary;
}

function hasReading(
  subject:
    | SubjectRadical
    | SubjectKanji
    | SubjectVocabulary
    | SubjectKanaVocabulary,
): subject is SubjectKanji | SubjectVocabulary {
  return "readings" in subject;
}

export default function Solution({
  continue_reviews,
  reviewType,
  subject,
}: Props) {
  return (
    <div className=" flex flex-col justify-between items-center h-100 py-5">
      <div className="text-6xl">{subject.characters}</div>
      {reviewType == ReviewType.Meaning && (
        <>
          <div className="text-2xl">
            {subject.meanings.map((x) => x.meaning).join(", ")}
          </div>
          <div>{subject.meaning_mnemonic}</div>
        </>
      )}
      {reviewType == ReviewType.Reading && hasReading(subject) && (
        <>
          <div className="text-2xl">
            {subject.readings.map((x) => x.reading).join(", ")}
          </div>
          <div>{subject.reading_mnemonic}</div>
        </>
      )}
      <button
        onClick={continue_reviews}
        className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center"
      >
        Continue
      </button>
    </div>
  );
}
