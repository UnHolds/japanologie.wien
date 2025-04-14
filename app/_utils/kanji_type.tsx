
export interface Reading {
    romaji: string,
    katakana: string,
    hiragana: string,
    meaning: string
}

export interface Radical {
    short: string
    long: string|null,
}

export interface Kanji {
    kanji: string,
    main_meaning: string
    radical: Radical,
    number: number
    strokes: number,
    frequency: number,
    book: string,
    section: string,
    on_yomi: Reading[]
    kun_yomi: Reading[]
}
