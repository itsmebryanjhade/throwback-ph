import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Throwback PH — Virtual Museum",
  description:
    "An interactive museum of Philippine popular culture from 2000 to 2010.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
