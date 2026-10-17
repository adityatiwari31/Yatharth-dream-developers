import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section-pad text-center">
      <h1 className="!text-[2.1rem]">That page is not here</h1>
      <p className="mt-3 text-muted">The link may be old, or the villa may have been removed.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/villas" className="btn btn-primary">
          See the villas
        </Link>
        <Link href="/" className="btn btn-outline">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
