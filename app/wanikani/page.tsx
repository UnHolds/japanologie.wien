
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div>
          <div className="text-center md:text-7xl text-4xl font-bold">WaniKani</div>
          <div className="my-15 flex gap-5 md:flex-row flex-col mx-6">
            <Link className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center" href="/404">404</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
