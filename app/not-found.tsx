import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-serif text-4xl font-medium text-charcoal">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-charcoal-light">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-sm border border-charcoal px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
      >
        Return Home
      </Link>
    </div>
  );
}
