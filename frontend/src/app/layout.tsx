import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

import ConditionalFloatingContact from "@/components/layout/ConditionalFloatingContact";
import ConditionalChatWidget from "@/components/layout/ConditionalChatWidget";

export const metadata: Metadata = {
  title: "Nội Thất NV Homes | Thiết kế & Thi công nội thất trọn gói",
  description: "Nội Thất NV Homes chuyên cung cấp giải pháp thiết kế và thi công nội thất cao cấp. Xưởng sản xuất trực tiếp tại Phúc Thọ, Hà Nội. Uy tín, chất lượng, giá xưởng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("scroll-smooth antialiased", "font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-stone-50 text-stone-950`}>
        <Navbar />
        {/* pt-16 đẩy nội dung xuống dưới Navbar cố định */}
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <ConditionalFloatingContact />
        <ConditionalChatWidget />
      </body>
    </html>
  );
}
