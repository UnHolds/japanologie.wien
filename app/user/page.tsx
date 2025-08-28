
import Link from "next/link";
import { format_furiana } from "../_utils/kanji_utils";

export default function User() {
  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div>
          <div className="text-center md:text-7xl text-4xl font-bold">User - ユーザー</div>
          <div className="my-15 flex gap-5 grid grid-cols-2 mx-6">

              <h4 className="text-xl">Name</h4>
              <input type="textbox" className="bg-white text-black"></input>

              <h4 className="text-xl">WaniKani API-Key</h4>
              <input type="textbox" className="bg-white text-black"></input>

              <button className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center">Load</button>
              <button className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
