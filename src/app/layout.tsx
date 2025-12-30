import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan System",
  description: "Bet plan system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
