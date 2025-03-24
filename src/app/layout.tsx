import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WheelPrice History",
  description: "Track historical prices of popular wheels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" 
          strategy="beforeInteractive"
        />
        <Script id="remove-latest-sale-price" strategy="afterInteractive">
          {`
            function removeSalePriceLabels() {
              const elements = document.querySelectorAll('.text-sm.text-gray-500.absolute.top-0.left-0');
              elements.forEach(el => {
                if (el.textContent && el.textContent.includes('Latest Sale Price')) {
                  el.style.display = 'none';
                }
              });
            }
            
            // Run on initial load
            if (document.readyState === 'complete') {
              removeSalePriceLabels();
            } else {
              window.addEventListener('load', removeSalePriceLabels);
            }
            
            // Set up observer to catch dynamically added elements
            const observer = new MutationObserver(function(mutations) {
              removeSalePriceLabels();
            });
            
            if (document.body) {
              observer.observe(document.body, { childList: true, subtree: true });
            } else {
              window.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, { childList: true, subtree: true });
              });
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
