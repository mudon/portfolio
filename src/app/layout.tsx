import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// Import Pixel One font
const pixelify = localFont({
  src: [
    {
      path: "../../public/fonts/pixel/PixelifySans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/pixel/PixelifySans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pixelify",
});

export const metadata: Metadata = {
  title: "Hazim's Portfolio",
  description: "Hazim's portfolio",
  openGraph: {
    title: "Hazim's Portfolio",
    description: "Hazim's portfolio",
    url: "https://mudon.github.io/portfolio/", // replace with your live domain
    images: [
      {
        url: "https://mudon.github.io/portfolio/metadata-images/my-website.png", // replace with your image
        width: 1200,
        height: 630,
        alt: "Hazim's Portfolio",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pixelify.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
