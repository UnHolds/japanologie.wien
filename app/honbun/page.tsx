import HonBun from "./_components/honbun";

import honbuns from "../assets/honbun.json";


export default function HonBunPage() {

    return (
        <div className="pt-8">
            <div className="text-6xl font-bold text-center mb-10">HonBuns</div>
            <div>
                <HonBun honbun={honbuns[0]} hide_furigana={false}></HonBun>
            </div>
        </div>
    );
  }
