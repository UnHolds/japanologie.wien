import { JSX } from "react";

type Props = {
    children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}

export default function HiddenElement({ children }: Props) {
    return (
        <>{children}</>
    );
  }
