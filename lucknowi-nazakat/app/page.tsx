import AnnouncementBar from '@/components/layout/AnnouncementBar';
import HeroSection from '@/components/home/HeroSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <AnnouncementBar />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}