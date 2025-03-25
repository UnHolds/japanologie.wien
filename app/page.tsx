import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div>
          <div className="text-center text-3xl">おはよう - Wilkommen</div>
          <div className="my-3">
            <Link className="bg-sky-500 p-2 rounded" href="/kanjilist">Kanji Liste</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
