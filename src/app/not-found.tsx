import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#051811] text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="text-6xl font-black text-emerald-400">404</div>
          <h1 className="text-2xl font-bold">পৃষ্ঠাটি পাওয়া যায়নি / Page Not Found</h1>
          <p className="text-white/70 text-sm">
            আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।
          </p>
          <div className="pt-4">
            <Link
              href="/bn"
              className="inline-block rounded-full bg-[#006a4e] hover:bg-[#005a42] text-white font-bold px-6 py-2.5 text-sm transition-colors shadow-md"
            >
              মূল পাতায় ফিরে যান / Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

