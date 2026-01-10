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

export default function Writing({ subject, reportResult }: Props) {
  return (
    <div>
      Writing
      <button onClick={() => reportResult(true)}>Correct</button>
    </div>
  );
}
