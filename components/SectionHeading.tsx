import Link from "next/link";

export default function SectionHeading({
  title,
  text,
  link,
  id,
}: {
  title: string;
  text?: string;
  link?: { href: string; label: string };
  id?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id}>{title}</h2>
        {text && <p className="mt-2 text-muted">{text}</p>}
      </div>
      {link && (
        <Link href={link.href} className="font-medium text-brass underline-offset-4 hover:underline">
          {link.label}
        </Link>
      )}
    </div>
  );
}
