import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContexts';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import Head from 'next/head';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' }, success: { duration: 3000, style: { background: '#10B981' } }, error: { duration: 4000, style: { background: '#EF4444' } } }} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}