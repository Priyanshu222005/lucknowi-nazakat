import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-center px-4">
      <h1 className="font-serif text-6xl font-bold text-[#6B1D2F] mb-4">404</h1>
      <h2 className="text-xl font-bold text-stone-800 mb-2">Page Not Found</h2>
      <p className="text-xs text-stone-500 mb-6">Aap jo page dhoondh rahe hain wo yahan nahi mila.</p>
      <Link
        href="/"
        className="bg-[#6B1D2F] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition"
      >
        Back To Home
      </Link>
    </div>
  );
}