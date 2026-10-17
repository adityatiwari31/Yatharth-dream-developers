import Image from "next/image";
import Stars from "./Stars";
import type { ReviewJSON } from "@/lib/villaTypes";

export default function ReviewCard({ review }: { review: ReviewJSON }) {
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";
  return (
    <figure className="card flex flex-col overflow-hidden">
      {review.photo?.url && (
        <div className="relative aspect-[4/3] bg-cream">
          <Image src={review.photo.url} alt={`Photo shared by ${review.name}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <Stars value={review.rating} />
        <blockquote className="mt-3 flex-1 text-[0.98rem] leading-relaxed text-ink/90">“{review.text}”</blockquote>
        <figcaption className="mt-4 text-[0.88rem] text-muted">
          <span className="block font-semibold text-ink">{review.name}</span>
          {review.bought && <span className="block">{review.bought}</span>}
          {date && <span className="block">{date}</span>}
        </figcaption>
      </div>
    </figure>
  );
}
