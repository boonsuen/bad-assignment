import { DTraceProvider } from '@/context/Dtrace';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>DTrace</title>
        <link rel="icon" href="/img/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${inter.variable} font-sans antialiased h-full`}>
        <Toaster position="top-right" />
        <DTraceProvider>
          <Component {...pageProps} />
        </DTraceProvider>
      </div>
    </>
  );
}
