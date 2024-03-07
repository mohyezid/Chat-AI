import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chat from "@/component/Chat";
import Provider from "@/component/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookbudy",
  description: "Your bookstore for fantasy & mystery books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
          <Chat />
          {children}
        </body>
      </Provider>
    </html>
  );
}
