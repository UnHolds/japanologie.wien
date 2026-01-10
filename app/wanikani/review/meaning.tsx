import {
  SubjectKanaVocabulary,
  SubjectKanji,
  SubjectRadical,
  SubjectVocabulary,
} from "../_api/subject";

interface Props {
  subject:
    | SubjectRadical
    | SubjectKanji
    | SubjectVocabulary
    | SubjectKanaVocabulary;
  reportResult: (correct: boolean) => void;
}

export default function Meaning({ subject, reportResult }: Props) {
  return (
    <div>
      Meaning
      <button onClick={() => reportResult(true)}>Correct</button>
    </div>
  );
}
