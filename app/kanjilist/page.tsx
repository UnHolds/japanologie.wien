import KanjiBox from "./_components/kanji_box";

import kanjis from "../assets/kanji.json";

export default function KanjiList() {
    return (
        <div className="my-10">
            <div className="text-center text-6xl font-bold mb-5">Kanji-Liste</div>
            <div className="w-full flex justify-center">
                <div className="h-full flex flex-col gap-6 lg:w-1/3 md:w-2/3">
                    {kanjis.map((k, i) => <KanjiBox key={i} kanji={k}/>)}
                </div>
            </div>
        </div>
    );
  }
