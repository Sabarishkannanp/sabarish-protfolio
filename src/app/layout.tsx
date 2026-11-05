import type { Metadata, Viewport } from "next";
import { Anton, Caveat, Inter } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat", display: "swap" });

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  keywords: ["Sabarish Kannan P", "MERN full stack developer", "MERN stack developer", "Next.js developer", "React developer", "Coimbatore", "web developer portfolio"],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title,
    description: site.description,
    siteName: `${site.firstName}'s Portfolio`,
    locale: "en_IN",
    images: [{ url: "/og.jpg", width: 1672, height: 941, alt: `${site.name} — portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/hero.png`,
  jobTitle: site.role,
  address: { "@type": "PostalAddress", addressLocality: "Coimbatore", addressCountry: "IN" },
  knowsAbout: ["MERN stack", "Next.js", "React", "Node.js", "MongoDB", "Responsive web design", "SEO"],
  sameAs: [site.github, site.linkedin, site.instagram],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
