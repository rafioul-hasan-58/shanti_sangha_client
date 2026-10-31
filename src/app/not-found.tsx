import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800 font-sans p-4">
        <div className="max-w-md text-center">
          <h1 className="text-6xl font-extrabold text-[#006a4e]">404</h1>
          <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/en"
            className="mt-6 inline-block rounded-md bg-[#006a4e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#005a42] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}

