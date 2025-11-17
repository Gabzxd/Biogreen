// frontend/app/layout.tsx
import "./styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-[#0B1020] text-neutral-50">
        <main className="max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}