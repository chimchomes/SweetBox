// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "SweetBox",
  description: "SweetBox builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
