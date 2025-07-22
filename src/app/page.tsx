import Link from 'next/link';

export default function Home() {
  return (
    <header className='flex justify-between items-center p-4 container mx-auto'>
      <span className='font-bold'>DLT</span>
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-6 inline-block transition-colors">Blog</Link>
    </header>
  );
}
