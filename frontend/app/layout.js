import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Research Radar",
  description: "AI Research Explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Header />

        {children}
      </body>
    </html>
  );
}