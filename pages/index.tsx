import { LogoSvg } from '@/components/svg/Logo.svg';
import Link from 'next/link';

//Internal Import
import { DTraceContext, DTraceProvider } from '../context/Dtrace';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { connectWallet, checkIfWalletIsConnected } = useContext(DTraceContext);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const handleLoginWithMetamask = () => {
    connectWallet();
  };

  return (
    <main className="h-full p-10 flex justify-center items-center flex-col">
      <LogoSvg className="h-[42px] w-[149px] object-contain mb-8" />
      <button
        className="bg-primary font-medium text-white w-[245px] h-12 rounded"
        onClick={handleLoginWithMetamask}
      >
        Login with Metamask
      </button>
      <span className="my-3">or</span>
      <Link
        href="/check"
        className="font-medium flex items-center justify-center text-primary w-[245px] h-12 rounded border border-primary"
      >
        Continue without Login
      </Link>
    </main>
  );
}
