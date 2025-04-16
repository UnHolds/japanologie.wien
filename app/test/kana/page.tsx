"use client"
import { useEffect, useLayoutEffect, useState } from "react";
import KanjiDraw from "../kanji/_components/kanji_draw";
import { toRomaji } from 'wanakana';

export default function KanaTest() {

    const [hiragana, setHiragana] = useState(true);
    const [katakana, setKatakana] = useState(false);
    const [dakutenHira, setDakutenHira] = useState(false);
    const [dakutenKata, setDakutenKata] = useState(false);
    const [kana, setKana] = useState<string>("た");
    const [list, setList] = useState<string[]>(['空']);


    const [size, setSize] = useState(250);

    function get_kana(l: string[]) {
        setKana(l[Math.floor(Math.random()*l.length)]);
    }

    function correct() {
        let l = list.filter((v) => v != kana);
        if(l.length == 0){
            l = ['了']
        }
        setList(l)
        get_kana(l)
    }

    function wrong() {
        get_kana(list)
    }

    useEffect(() => {
        const hiragana_list = "あいうえお かきくけこ さしすせそ たちつてと なにぬねの はひふへほ やゆよ らりるれろ わを ん".replaceAll(" ", "").split("");
        const katakana_list = "アイウエオ カキクケコ サシスセソ タチツテト ナニヌネノ ハヒフヘホ ヤユヨ ラリルレロ ワヲ ン".replaceAll(" ", "").split("");
        const hiragana_dakuten_list = "がぎぐげご ざじずぜぞ だぢづでど ばびぶべぼ ぱぴぷぺぽ".replaceAll(" ", "").split("");
        const katakana_dakuten_list = "ガギグゲゴ ザジズゼゾ ダヂヅデド バビブベボ パピプペポ".replaceAll(" ", "").split("");
        let l: string[] = [];
        if(hiragana){
            l = l.concat(hiragana_list)
        }
        if(katakana){
            l = l.concat(katakana_list)
        }
        if(dakutenHira){
            l = l.concat(hiragana_dakuten_list)
        }
        if(dakutenKata){
            l = l.concat(katakana_dakuten_list)
        }
        if(l.length == 0){
            l = ['空']
        }
        setList(l);
        get_kana(l)
    }, [hiragana, katakana, dakutenHira, dakutenKata])

    useEffect(() => {
        if(typeof window != "undefined" && window.innerWidth < 500){
            setSize(window.innerWidth-3);
        }else{
            setSize(250)
        }
    }, [])

    useLayoutEffect(() => {
        function updateSize() {
            if(typeof window != "undefined" && window.innerWidth < 500){
                setSize(window.innerWidth-3);
            }else{
                setSize(200)
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div>
            <div>
                <div className="text-center text-6xl font-bold my-5">Kana-Test</div>
                <div className="text-center text-2xl font-bold mb-2">Settings</div>
                <div className="flex justify-center gap-6 mb-5 md:flex-row flex-col items-center">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="draw_hiragana" className="w-5 h-5" checked={hiragana} onChange={() => {setHiragana(!hiragana)}}/>
                        <label htmlFor="draw_hiragana" className="text-xl">Hiragana</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="draw_katakana" className="w-5 h-5" checked={katakana} onChange={() => {setKatakana(!katakana)}}/>
                        <label htmlFor="draw_katakana" className="text-xl">Katakana</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="draw_hiraganadakuten" className="w-5 h-5" checked={dakutenHira} onChange={() => {setDakutenHira(!dakutenHira)}}/>
                        <label htmlFor="draw_hiraganadakuten" className="text-xl">Dakuten (Hira)</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="draw_katakanadakuten" className="w-5 h-5" checked={dakutenKata} onChange={() => {setDakutenKata(!dakutenKata)}}/>
                        <label htmlFor="draw_katakanadakuten" className="text-xl">Dakuten (Kata)</label>
                    </div>
                </div>
            </div>
            <div className="text-center text-2xl  font-bold">Items left: {list.length}</div>
            <div className="flex justify-center mt-10">
                <KanjiDraw kanji={kana} name={toRomaji(kana)} height={size} width={size}/>
            </div>
            <div className="flex gap-5 justify-center w-full mt-20">
                <button className="flex bg-emerald-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={correct}>Correct</button>
                <button className="flex bg-rose-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center w-45" onClick={wrong}>Wrong</button>
            </div>

        </div>
    );
  }
