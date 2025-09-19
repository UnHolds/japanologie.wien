import KanjiDraw from "../_components/kanji_draw/kanji_draw";
import { Kanji } from "../_utils/kanji_type";

export default function KanjiBox() {
  const k: Kanji = {
    kanji: "三",
    main_meaning: "three",
    radical: {
      short: "no idea",
      long: null,
    },
    number: 1,
    strokes: 3,
    frequency: 0,
    book: "",
    section: "",
    on_yomi: [],
    kun_yomi: [],
  };
  return (
    <div>
      <KanjiDraw kanji={k} />
    </div>
  );
}
