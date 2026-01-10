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

interface Review {
  reading: boolean;
  meaning: boolean;
  writing: boolean;
  assignment: Assignment;
}

enum ReviewType {
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
    toast.info("All correct removing");
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

  const reportResult = (correct: boolean) => {
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
      shuffleArray(activeQueue);

      if (activeQueue.length == 0) {
        toast.info("All done!");
        //TODO: exit to wani kani main page
        return;
      }

      //updates current subject
      setReviewType(getReviewType(activeQueue[0]));
      get_subject_with_assignment(activeQueue[0].assignment).then((r) =>
        setCurrentSubject(r),
      );

      //update queues
      setActiveQueue(activeQueue);
      setAssignments(assignments);
    } else {
      //TODO: report wrong answer
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="bg-amber-900 w-1/3 h-1/3">
        {reviewType == ReviewType.Meaning && currentSubject != undefined && (
          <Meaning subject={currentSubject} reportResult={reportResult} />
        )}

        {reviewType == ReviewType.Writing && currentSubject != undefined && (
          <Writing subject={currentSubject} reportResult={reportResult} />
        )}

        {reviewType == ReviewType.Reading &&
          currentSubject != undefined &&
          hasReading(currentSubject) && (
            <Reading subject={currentSubject} reportResult={reportResult} />
          )}
      </div>

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
