import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M1 Capital Algorithmic Trading",
  description: "A standalone trading application scaffold for Charles Schwab API automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
