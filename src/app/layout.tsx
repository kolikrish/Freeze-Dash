import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freeze Dash | Red Light, Green Light Game",
  description: "Play Freeze Dash! An interactive Red Light, Green Light web game supporting Single Player and Real-Time Multiplayer rooms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#1A212D] text-white">
        {children}
      </body>
    </html>
  );
}
