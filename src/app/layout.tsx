import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auteur · Autonomous Video Director & Iterative Cut Studio",
  description:
    "An agent-native creative studio powered by Livepeer Agent. Transforming single-sentence briefs into multi-shot cinematic films with an interactive Direct, Review, and Refine loop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-teal selection:text-black">
        {children}
      </body>
    </html>
  );
}
