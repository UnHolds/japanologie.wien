import { get_settings  } from "@/app/user/settings";



enum SubjectType {
    Radical,
    Kanji,
    Vocabulary,
    KanaVocabulary
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

export async function get_assignments(): Promise<[Assignment]> {
    const url = API_URL + "assignments?immediately_available_for_review";

    return (await get_data<WaniKaniObject<[Assignment]>>(url)).data;
}
