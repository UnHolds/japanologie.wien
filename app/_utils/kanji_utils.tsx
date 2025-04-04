import { JSX } from "react";
import HiddenElement from "./hidden_element";

export function format_furiana(text: string, hide_furigana: boolean): JSX.Element[] {

    const t = text.replace(/{([^}]+)\|([^}]+)}/g, "<ruby>\$1<rt>\$2</rt><ruby>");

    const html = t.split("<ruby>").map((s, i) => {

        if (s.indexOf('<rt>') <= -1) {
            return <HiddenElement key={i}>{s}</HiddenElement>
        }

        const rb = s.split("<rt>").map((ss, ii) => {
            if (ss.indexOf('</rt>') <= -1) {
                return <HiddenElement key={ii}>{ss}</HiddenElement>
            }else if (hide_furigana == false){
                return <rt key={ii}>{ss.replace("</rt>","")}</rt>
            }else{
                //no furigana
                return <HiddenElement key={ii}/>
            }
        })

        if (hide_furigana){
            return <HiddenElement key={i}>{rb}</HiddenElement>
        }else{
            return <ruby key={i}>{rb}</ruby>
        }
    });

    return html
}
