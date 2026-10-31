import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const latin = Inter({ subsets: ["latin"], variable: "--font-latin" });
const bangla = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bangla" });

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.meta.title, description: dict.meta.description };
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${latin.variable} ${bangla.variable}`}>
      <body className="font-sans">
        <RoleProvider>
          <Navbar locale={locale} dict={dict} />
          {children}
          <Footer dict={dict} />
        </RoleProvider>
      </body>
    </html>
  );
}
