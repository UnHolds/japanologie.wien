
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div>
          <div className="text-center text-7xl font-bold">おはよう - Willkommen</div>
          <div className="my-15 flex gap-5">
            <Link className="bg-sky-700 p-4 rounded text-4xl font-bold" href="/kanjilist">Kanji Liste</Link>
            <Link className="bg-sky-700 p-4 rounded text-4xl font-bold" href="https://github.com/UnHolds/japanologie.wien">GitHub (DEV)</Link>
            <Link className="bg-sky-700 p-4 rounded text-4xl font-bold" href="https://ko-fi.com/unhold">Support (Ko-fi)</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
