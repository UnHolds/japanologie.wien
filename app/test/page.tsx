"use client";
import KanjiDraw from "../_components/kanji_draw/kanji_draw";

export default function KanjiBox() {
  return (
    <div className="w-100">
      <KanjiDraw kanji={"か"} verify_callbackAction={(r) => alert(r)} />
    </div>
  );
}
