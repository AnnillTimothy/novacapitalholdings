import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nova Capital Holdings",
  description:
    "A futuristic, highly strategic holdings company with a diverse global portfolio.",
  keywords: ["investment", "holdings", "portfolio", "capital", "finance"],
  openGraph: {
    title: "Nova Capital Holdings",
    description: "Building Tomorrow's Legacy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
