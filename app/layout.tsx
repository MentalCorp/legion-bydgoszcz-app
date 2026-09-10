import "./globals.css";

export const metadata = {
  title: "Legion Bydgoszcz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}