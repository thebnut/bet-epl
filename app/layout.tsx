import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BetOdds EPL - Compare Australian Bookmaker Odds',
  description: 'Compare EPL betting odds across Australian bookmakers including Sportsbet, TAB, Neds, and more. Find the best odds instantly.',
  keywords: 'EPL odds, Premier League betting, Australian bookmakers, odds comparison, sports betting',
  authors: [{ name: 'BetOdds' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'BetOdds EPL - Compare Australian Bookmaker Odds',
    description: 'Find the best EPL betting odds from Australian bookmakers',
    type: 'website',
    locale: 'en_AU',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-primary-600">
                      BetOdds <span className="text-gray-600">EPL</span>
                    </h1>
                  </div>
                  <div className="text-sm text-gray-500">
                    Australian Bookmaker Comparison
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="mt-auto bg-white border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-sm text-gray-500">
                  <p className="mb-2">
                    Gamble Responsibly. 18+ Only.
                  </p>
                  <p>
                    Odds are for information purposes only. Always check with bookmakers directly.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}