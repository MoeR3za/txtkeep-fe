import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: "TXTKeep",
  description: 'A modern file upload and management system',
  icons: {
    // These are automatically handled by Next.js from our icon.tsx and apple-icon.tsx
    icon: [
      { url: '/icon' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
