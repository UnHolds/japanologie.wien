import Account from "./account";

import Link from "next/link";
export default function TopBar() {
  return (
    <div className="w-full h-19 sticky flex gap-3 items-center justify-end pr-22 top-0">
        <Account className="absolute right-2 top-2"/>
        <Link className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center" href="/">Home</Link>
        <Link className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center" href="/japanologie">Japanologie</Link>
        <Link className="flex bg-sky-700 p-2 rounded md:text-2xl text-xl font-bold items-center" href="/wanikani">WaniKani</Link>
    </div>
  );
}
