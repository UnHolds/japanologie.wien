"use client";

import { useEffect, useState } from "react";
import {
  Assignment,
  get_assignments,
  get_subject_with_assignment,
  SubjectType,
} from "../_api/api";
import { toast } from "react-toastify";
import {
  SubjectKanaVocabulary,
  SubjectKanji,
  SubjectRadical,
  SubjectVocabulary,
} from "../_api/subject";
import Meaning from "./meaning";
import Reading from "./reading";
import Writing from "./writing";
import Solution from "./solution";

interface Review {
  reading: boolean;
  meaning: boolean;
  writing: boolean;
  num_wrong_reading: number;
  num_wrong_meaning: number;
  num_wrong_writing: number;
  assignment: Assignment;
}

export enum ReviewType {
  Reading = "Reading",
  Meaning = "Meaning",
  Writing = "Writing",
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const ACTIVE_QUEUE_SIZE = 10;

function toReview(assignment: Assignment): Review {
  return {
    reading: assignment.subject_type == SubjectType.Radical, //only radicals have no reading
    meaning: false,
    writing: assignment.subject_type != SubjectType.Kanji, //only kanji have writing
    num_wrong_meaning: 0,
    num_wrong_reading: 0,
    num_wrong_writing: 0,
    assignment: assignment,
  };
}

function getReviewType(review: Review): ReviewType {
  const type = [ReviewType.Reading, ReviewType.Writing, ReviewType.Meaning];
  shuffleArray(type);

  for (let i = 0; i < 3; i++) {
    if (type[i] == ReviewType.Reading && review.reading == false) {
      return ReviewType.Reading;
    }
    if (type[i] == ReviewType.Writing && review.writing == false) {
      return ReviewType.Writing;
    }
    if (type[i] == ReviewType.Meaning && review.meaning == false) {
      return ReviewType.Meaning;
    }
  }

  toast.error("Found assignment with no valid review type");
  //should not be reached
  return ReviewType.Writing;
}

function updateQueues(activeQueue: Review[], assignment: Assignment[]) {
  if (
    activeQueue[0].meaning == true &&
    activeQueue[0].reading == true &&
    activeQueue[0].writing == true
  ) {
    //all answered -> removing and reporting
    console.log("All parts of element correct -> removing");
    //TODO: report via api
    activeQueue.shift();

    //add new item
    const newItem = assignment.shift();
    if (newItem != undefined) {
      activeQueue.push(toReview(newItem));
    }
  }

  return [activeQueue, assignment];
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

export default function Review() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeQueue, setActiveQueue] = useState<Review[]>([]);
  const [currentSubject, setCurrentSubject] = useState<
    SubjectRadical | SubjectKanji | SubjectVocabulary | SubjectKanaVocabulary
  >();
  const [reviewType, setReviewType] = useState(ReviewType.Writing);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);

  useEffect(() => {
    console.log("Fetching assignments");
    get_assignments()
      .then((r) => {
        shuffleArray(r); //for random order
        const active = r
          .slice(0, Math.min(ACTIVE_QUEUE_SIZE, r.length))
          .map((a) => toReview(a));
        setActiveQueue(active);
        if (r.length > ACTIVE_QUEUE_SIZE) {
          setAssignments(r.slice(ACTIVE_QUEUE_SIZE));
        }

        setReviewType(getReviewType(active[0]));
        get_subject_with_assignment(active[0].assignment).then((r) =>
          setCurrentSubject(r),
        );
      })
      .catch(() => toast.error("Could not fetch assignments"));
  }, []);

  const get_next_review = () => {
    shuffleArray(activeQueue);

    //updates current subject
    setReviewType(getReviewType(activeQueue[0]));
    get_subject_with_assignment(activeQueue[0].assignment).then((r) =>
      setCurrentSubject(r),
    );

    //update queues
    setActiveQueue(activeQueue);
    setAssignments(assignments);
  };

  const reportResult = (correct: boolean) => {
    setLastCorrect(correct);
    console.log("Answer is correct: ", correct);
    if (correct) {
      switch (reviewType) {
        case ReviewType.Meaning:
          activeQueue[0].meaning = true;
          break;
        case ReviewType.Reading:
          activeQueue[0].reading = true;
          break;
        case ReviewType.Writing:
          activeQueue[0].writing = true;
          break;
      }
      updateQueues(activeQueue, assignments);

      if (activeQueue.length == 0) {
        toast.info("All done!");
        window.open("/wanikani");
        return;
      }

      get_next_review();
    } else {
      switch (reviewType) {
        case ReviewType.Meaning:
          activeQueue[0].num_wrong_meaning += 1;
          break;
        case ReviewType.Reading:
          activeQueue[0].num_wrong_reading += 1;
          break;
        case ReviewType.Writing:
          activeQueue[0].num_wrong_writing += 1;
          break;
      }
      //show soultion not for writing
      if (reviewType != ReviewType.Writing) {
        setShowQuestion(false);
      }
    }
  };

  const continue_review = () => {
    get_next_review();
    setShowQuestion(true);
  };

  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="w-100 ">
        {reviewType == ReviewType.Meaning &&
          currentSubject != undefined &&
          showQuestion && (
            <Meaning subject={currentSubject} reportResult={reportResult} />
          )}

        {reviewType == ReviewType.Writing &&
          currentSubject != undefined &&
          showQuestion && (
            <Writing
              subject={currentSubject}
              reportResult={reportResult}
              continue_review={continue_review}
            />
          )}

        {reviewType == ReviewType.Reading &&
          currentSubject != undefined &&
          hasReading(currentSubject) &&
          showQuestion && (
            <Reading subject={currentSubject} reportResult={reportResult} />
          )}

        {showQuestion == false && currentSubject != undefined && (
          <Solution
            continue_reviews={continue_review}
            reviewType={reviewType}
            subject={currentSubject}
          />
        )}
      </div>

      <div>Last was correct: {lastCorrect + ""}</div>
      <div>Assignments remain: {assignments.length}</div>
      <div>Active remain: {activeQueue.length}</div>

      <div>
        Reading: {activeQueue.length > 0 && activeQueue[0].reading + ""}
      </div>
      <div>
        Meaning: {activeQueue.length > 0 && activeQueue[0].meaning + ""}
      </div>
      <div>
        Writing: {activeQueue.length > 0 && activeQueue[0].writing + ""}
      </div>
      <div>Current Type: {reviewType}</div>
      <div>Subject: {currentSubject?.level}</div>
    </div>
  );
}
