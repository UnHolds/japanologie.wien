import { get_settings  } from "@/app/user/settings";
import { SubjectBase, SubjectKanaVocabulary, SubjectKanji, SubjectRadical, SubjectVocabulary } from "./subject";



export enum SubjectType {
    Radical = "radical",
    Kanji = "kanji",
    Vocabulary = "vocabulary",
    KanaVocabulary = "kana_vocabulary"
}


interface WaniKaniObject<Type> {
    id: number,
    object: string,
    url: string,
    data_updated_at: Date,
    data: Type
}

export interface Assignment {
    created_at: Date,
    subject_id: number,
    subject_type: SubjectType
    srs_stage: number,
    unlocked_at: Date|null,
    started_at: Date|null,
    passed_at: Date|null,
    burned_at: Date|null,
    available_at: Date|null,
    resurrected_at: Date|null,
    hidden: boolean
}


export function api_key_exists(): boolean {
    return get_settings().wanikani.api_key.trim() != "";
}

const API_URL = "https://api.wanikani.com/v2/"

async function get_data<T>(url: string) {

    const api_key = get_settings().wanikani.api_key;

    if(api_key_exists() == false){
        return Promise.reject("API_KEY is missing")
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${api_key}`
        }
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json() as T
}

export async function get_assignments(): Promise<Assignment[]> {
    const url = API_URL + "assignments?immediately_available_for_review";
    return (await get_data<WaniKaniObject<[WaniKaniObject<Assignment>]>>(url)).data.map(d => d.data);
}


export async function get_subject_with_id<T extends SubjectBase>(id: number): Promise<T> {

    const url = API_URL + "subjects/" + id;
    return (await get_data<WaniKaniObject<T>>(url)).data;
}

export async function get_subject_with_assignment(assignment: Assignment): Promise<SubjectRadical | SubjectKanji | SubjectVocabulary | SubjectKanaVocabulary> {

    const url = API_URL + "subjects/" + assignment.subject_id;

    switch(assignment.subject_type) {
        case SubjectType.Radical:
            return (await get_data<WaniKaniObject<SubjectRadical>>(url)).data;
        case SubjectType.Kanji:
            return (await get_data<WaniKaniObject<SubjectKanji>>(url)).data;
        case SubjectType.Vocabulary:
            return (await get_data<WaniKaniObject<SubjectVocabulary>>(url)).data;
        case SubjectType.KanaVocabulary:
            return (await get_data<WaniKaniObject<SubjectKanaVocabulary>>(url)).data;
    }
}
