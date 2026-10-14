import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خبير السيارات الذكي",
  description: "تشخيص أعطال السيارات في سوريا والمنطقة العربية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
