import { BlogSection } from '@/components/home/BlogSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider';
import { VideoSection } from '@/components/home/VideoSection';
import { WhyUsSection } from '@/components/home/WhyUsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyUsSection />
      <VideoSection />
      <TestimonialsSlider />
      <BlogSection />
      <InstagramGallery />
      <NewsletterSection />
    </>
  );
}
