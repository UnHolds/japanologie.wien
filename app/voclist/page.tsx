import vocs from "../assets/voc.json";
import VocBox from "./_components/voc_box";

export default function VocList() {
    let curr_lesson = -1;
    return (
        <div className="my-10">
            <div className="text-center text-6xl font-bold mb-5">Vokabel-Liste</div>
            <div className="w-full flex justify-center">
                <div className="h-full flex flex-col gap-2 xl:w-1/3 lg:w-2/3">
                    {
                    vocs.map((v, i) => {
                        let elems: React.JSX.Element[] = [];
                        if(curr_lesson != v.lesson) {
                            curr_lesson = v.lesson;
                            elems.push(<div key={`${i}-l`} className="text-center font-bold text-4xl">{curr_lesson} 課</div>);
                            elems.push(<div  key={`${i}-lb`} className="border-t-1"/>);
                        }
                        elems.push(<VocBox key={`${i}-voc`} voc={v}/>);
                        elems.push(<div  key={`${i}-b`} className="border-t-1"/>);
                        return elems;
                    })
                    }
                </div>
            </div>
        </div>
    );
  }
