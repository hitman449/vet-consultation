import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetCare - Online Veterinary Consultations",
  description:
    "Book online consultations with expert veterinary doctors. Pay securely and consult via video call.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
