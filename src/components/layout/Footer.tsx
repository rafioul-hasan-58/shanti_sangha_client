import type { Dictionary } from "@/i18n/getDictionary";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-16 bg-pitch py-6 text-center text-sm text-brand-200">
      © {new Date().getFullYear()} {dict.brand}. {dict.footer.rights}
    </footer>
  );
}
