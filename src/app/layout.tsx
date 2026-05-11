import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishal Buyyarapu - Software Engineer",
  description: "Portfolio of Vishal Buyyarapu - Software Engineer and Competitive Programmer. Built with Next.js and optimized for mobile.",
  keywords: ["software engineer", "competitive programmer", "portfolio", "React", "JavaScript", "Python"],
  authors: [{ name: "Vishal Buyyarapu" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vishal Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  const isLocalDev = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

                  if (isLocalDev) {
                    navigator.serviceWorker.getRegistrations()
                      .then(function(registrations) {
                        registrations.forEach(function(registration) {
                          registration.unregister();
                        });
                      });

                    if ('caches' in window) {
                      caches.keys().then(function(cacheNames) {
                        cacheNames.forEach(function(cacheName) {
                          caches.delete(cacheName);
                        });
                      });
                    }

                    return;
                  }

                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // Disable pull-to-refresh on mobile
              if ('ontouchstart' in window) {
                let startY = 0;
                document.addEventListener('touchstart', (e) => {
                  startY = e.touches[0].clientY;
                });
                document.addEventListener('touchmove', (e) => {
                  if (document.scrollingElement.scrollTop === 0 && e.touches[0].clientY > startY) {
                    e.preventDefault();
                  }
                }, { passive: false });

                // Add touch feedback
                document.addEventListener('touchstart', (e) => {
                  const target = e.target.closest('button, a, [role="button"]');
                  if (target) {
                    target.style.transform = 'scale(0.98)';
                  }
                }, { passive: true });

                document.addEventListener('touchend', (e) => {
                  const target = e.target.closest('button, a, [role="button"]');
                  if (target) {
                    target.style.transform = '';
                  }
                }, { passive: true });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
