import type { Metadata } from "next";
import "./globals.css";
import { ClientWrapper } from "./client-wrapper";

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
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
