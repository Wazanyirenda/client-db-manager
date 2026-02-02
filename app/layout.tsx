import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cliently",
  description: "Cliently - The simple CRM for your business",
  icons: {
    icon: "/cliently-logo.png",
    shortcut: "/cliently-logo.png",
    apple: "/cliently-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        {children}
        <Toaster 
          position="top-right" 
          richColors
          expand={true}
          closeButton={true}
          toastOptions={{
            style: {
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            },
            classNames: {
              toast: 'toast-custom',
              title: 'toast-title',
              description: 'toast-description',
              actionButton: 'toast-action-button',
              cancelButton: 'toast-cancel-button',
            },
          }}
        />
      </body>
    </html>
  );
}

