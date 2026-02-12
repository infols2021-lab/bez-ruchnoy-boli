import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Автоматизация, боты и AI — услуги",
  description: "Автоматизация Google Таблиц, Telegram-боты и AI. Быстрое MVP и понятные цены.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
