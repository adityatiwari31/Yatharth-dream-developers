import type { Metadata } from "next";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "./ReviewForm";
import Stars from "@/components/Stars";
import { getApprovedReviews, getReviewStats } from "@/lib/data";
import { WA_GENERAL } from "@/lib/config";

export const revalidate = 60; // cached, refreshed within a minute (and instantly after admin changes)

export const metadata: Metadata = {
  title: "Customer reviews",
  description: "Feedback and photos from families who bought a villa from us or visited our sites in Vatika, Jaipur.",
};

export default async function ReviewsPage() {
  const [reviews, stats] = await Promise.all([getApprovedReviews(), getReviewStats()]);

  return (
    <div className="wrap section-pad">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">Your experience matters</h1>
          <p className="lead mt-3">Bought a villa from us, or visited our site? Tell us how we did. Your words and photos help the next family decide with confidence.</p>
          {stats.count > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <Stars value={stats.avg} className="h-5 w-5" />
              <span className="font-display text-[1.6rem]">{stats.avg}</span>
              <span className="text-muted">
                out of 5, {stats.count} review{stats.count === 1 ? "" : "s"}
              </span>
            </div>
          )}
          <blockquote className="mt-8 border-l-4 border-brass pl-5 font-display text-[1.25rem] leading-snug">Every home is a promise. Tell us how we kept ours.</blockquote>
          <p className="mt-6 text-[0.9rem] text-muted">
            Prefer WhatsApp?{" "}
            <a href={WA_GENERAL} target="_blank" rel="noopener" className="font-medium text-brass">
              Send your feedback there
            </a>{" "}
            and we will add it with your permission.
          </p>
        </div>
        <ReviewForm />
      </div>

      <section className="mt-16" aria-labelledby="all-reviews">
        <h2 id="all-reviews" className="!text-[1.7rem]">
          {reviews.length ? "Reviews from families" : "Reviews will appear here"}
        </h2>
        {reviews.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r._id} review={r} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-muted">The first review published here will be from a real family, with their photo. Be the first to write one.</p>
        )}
      </section>
    </div>
  );
}
