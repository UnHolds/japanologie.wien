"use client"

import { useEffect, useState } from "react";
import { Assignment, get_assignments, get_subject_with_assignment, SubjectType } from "../_api/api";
import { toast } from "react-toastify";
import { SubjectKanaVocabulary, SubjectKanji, SubjectRadical, SubjectVocabulary } from "../_api/subject";


interface Review {
    reading: boolean,
    meaning: boolean,
    writing: boolean
    assignment: Assignment
}

enum ReviewType {
    Reading,
    Meaning,
    Writing
}


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
        assignment: assignment
    }
}

function getReviewType(review: Review): ReviewType {
    let type = [ReviewType.Reading, ReviewType.Writing, ReviewType.Meaning];
    shuffleArray(type);

    for(let i = 0; i < 3; i++){
        if(type[i] == ReviewType.Reading && review.reading == false){
            return ReviewType.Reading;
        }
        if(type[i] == ReviewType.Writing && review.writing == false){
            return ReviewType.Writing;
        }
        if(type[i] == ReviewType.Meaning && review.meaning == false){
            return ReviewType.Meaning;
        }
    }

    toast.error("Found assignment with no valid review type")
    //should not be reached
    return ReviewType.Writing;
}

export default function Review() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [activeQueue, setActiveQueue] = useState<Review[]>([]);
    const [currentSubject, setCurrentSubject] = useState<SubjectRadical | SubjectKanji | SubjectVocabulary | SubjectKanaVocabulary>();
    const [reviewType, setReviewType] = useState(ReviewType.Writing);
    useEffect(() => {
        get_assignments().then(r => {
            shuffleArray(r); //for random order
            let active = r.slice(0, Math.min(ACTIVE_QUEUE_SIZE, r.length)).map(a => toReview(a));
            setActiveQueue(active);
            if(r.length > ACTIVE_QUEUE_SIZE){
                setAssignments(r.slice(ACTIVE_QUEUE_SIZE))
            }

            setReviewType(getReviewType(active[0]));
            get_subject_with_assignment(active[0].assignment).then(r => setCurrentSubject(r));

        }).catch(() => toast.error("Could not fetch assignments"));
    }, []);

    return <div>
        Some
    </div>
}
