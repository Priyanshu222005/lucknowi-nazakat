import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}