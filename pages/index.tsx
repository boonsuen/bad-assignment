import { LogoSvg } from '@/components/svg/Logo.svg';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-full p-10 flex justify-center items-center flex-col">
      <LogoSvg className="h-[42px] w-[149px] object-contain mb-8" />
      <button className="bg-primary text-white w-[245px] h-12 rounded">
        Login with Metamask
      </button>
      <span className="my-3">or</span>
      <Link
        href="/check"
        className="flex items-center justify-center text-primary w-[245px] h-12 rounded border border-primary"
      >
        Continue without Login
      </Link>
    </main>
  );
}
