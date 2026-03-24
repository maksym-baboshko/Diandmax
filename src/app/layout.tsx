import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diandmax",
  description: "Maksym & Diana — June 28, 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
