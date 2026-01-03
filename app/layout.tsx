import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "أوبن فورم - أنشئ نماذج جميلة",
  description: "قم ببناء نماذج مذهلة بأسلوب TypeForm في دقائق. مجاني ومفتوح المصدر.",
  verification: {
    google: "K5CGAgOeqTb2TYx35RT7JzOB6TvMGbF-TZAd3p-wWAM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${rubik.variable} font-sans antialiased`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
