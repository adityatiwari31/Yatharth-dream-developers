import { StarIcon } from "./Icons";

export default function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-brass-light" aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={className} filled={n <= Math.round(value)} />
      ))}
    </span>
  );
}
