import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-6xl font-extrabold text-[#006a4e]">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-pitch">Page Not Found</h2>
      <p className="mt-2 text-sm text-brand-600 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-sm bg-[#006a4e] px-6 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white hover:bg-[#005a42] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

