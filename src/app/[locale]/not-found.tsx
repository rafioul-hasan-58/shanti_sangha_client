import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl font-black text-[#006a4e] mb-3">404</div>
      <h1 className="text-2xl font-bold text-pitch mb-2">পৃষ্ঠাটি পাওয়া যায়নি / Page Not Found</h1>
      <p className="text-brand-600 text-sm max-w-md mb-6">
        আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরানো হয়েছে বা লিংকটি সঠিক নয়।
      </p>
      <Link
        href="/bn"
        className="rounded-full bg-[#006a4e] hover:bg-[#005a42] text-white font-bold px-6 py-2.5 text-sm transition-colors shadow-sm"
      >
        মূল পাতায় ফিরুন / Back to Home
      </Link>
    </div>
  );
}

