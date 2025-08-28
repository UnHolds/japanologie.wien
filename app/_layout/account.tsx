import Link from "next/link";


interface Props {
    className?: string
}


export default function Account({ className }: Props) {
  return (
    <Link className={`h-15 w-15 bg-cyan-300 rounded-full ${className}`} href="/user">
    </Link>
  );
}
