import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Joe Letchford",
  description: "Art Director & Visual Designer",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
