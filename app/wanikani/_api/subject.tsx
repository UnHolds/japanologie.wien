
export interface SubjectBase {
    auxiliary_meanings: AuxiliaryMeaning[];
    characters: string | null;
    created_at: Date;
    document_url: string;
    hidden_at: Date | null;
    lesson_position: number;
    level: number;
    meaning_mnemonic: string;
    meanings: Meaning[];
    slug: string;
    spaced_repetition_system_id: number;
}

interface Meaning {
    meaning: string;
    primary: boolean;
    accepted_answer: boolean;
}

interface AuxiliaryMeaning {
    meaning: string,
    type: string
}


// Radical

export interface SubjectRadical extends SubjectBase {
    amalgamation_subject_ids: number[];
    character_images: CharacterImage[];
}


interface CharacterImage {
    url: string,
    content_type: string,
    metadata: any
    inline_styles: boolean
}

// Kanji

export interface SubjectKanji extends SubjectBase {
    amalgamation_subject_ids: number[],
    component_subject_ids: number[],
    meaning_hint: string | null,
    reading_hint: string | null,
    reading_mnemonic: string,
    readings: KanjiReadingObject[],
    visually_similar_subject_ids: number[]
}

enum ReadingType {
    Kunyomi,
    Nanori,
    Onyomi
}

interface KanjiReadingObject  {
    reading: string,
    primary: boolean,
    accepted_answer: boolean,
    type: ReadingType
}

// Vocabulary

export interface SubjectVocabulary extends SubjectBase {
    component_subject_ids: number[],
    context_sentences: ContextSentenceObject[],
    meaning_mnemonic: string,
    parts_of_speech: string[],
    pronunciation_audios: PronunciationAudioObject[],
    readings: VocabularyReadingObject[],
    reading_mnemonic: string
}

interface VocabularyReadingObject {
    accepted_answer: boolean,
    primary: boolean,
    reading: string
}

interface ContextSentenceObject {
    en: string,
    ja: string
}

interface PronunciationAudioObject {
    url: string,
    content_type: string,
    metadata: {
        gender: string,
        source_id: number,
        pronunciation: string,
        voice_actor_id: number,
        voice_actor_name: string,
        voice_description: string
    }
}

// Kana Voc

export interface SubjectKanaVocabulary extends SubjectBase {
    context_sentences: ContextSentenceObject[],
    meaning_mnemonic: string,
    parts_of_speech: string[],
    pronunciation_audios: PronunciationAudioObject[]
}
