import type { Metadata } from "next";
import "./globals.css";

const TITLE = "ASL · A Tour of 2000–2010 | Philippine Pop Culture Museum";
const DESCRIPTION =
  "Archive · Share · Learn. Explore Filipino pop culture from 2000 to 2010 on a nostalgic desktop: Nokia texting, Friendster, comp shops, OPM, reality TV, Asianovelas, and P-pop.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "ASL",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "ASL: A Tour of 2000–2010",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
