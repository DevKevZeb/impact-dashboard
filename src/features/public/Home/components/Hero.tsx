import React, { useState, useEffect } from 'react';
import type { RefObject } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  images: string[];
  scrollToRef: RefObject<HTMLDivElement | null>;
  transitionInterval?: number;
  overlayOpacity?: number;
  scrollButtonText?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, images, scrollToRef, transitionInterval = 5000, overlayOpacity = 40, scrollButtonText = 'Scroll Down' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500);
    }, transitionInterval);

    return () => clearInterval(interval);
  }, [images.length, transitionInterval]);

  const scrollToContent = () => {
    if (scrollToRef.current) {
      const elementTop = scrollToRef.current.offsetTop;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative h-[92vh] w-full overflow-hidden">
      {images.map((image, index) => (
        <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-2000 ease-in-out ${index === currentImageIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'} `} style={{ backgroundImage: `url('${image}')` }} >
  <div
    className="absolute inset-0 bg-black transition-opacity duration-2000"
    style={{ opacity: overlayOpacity / 100 }}
  />
</div>

      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-7xl drop-shadow-lg">
          {title}
        </h1>
        <p className="mb-12 mt-10 max-w-3xl text-lg text-white md:text-2xl drop-shadow-md">
          {subtitle}
        </p>

        <div className="absolute bottom-12 flex flex-col items-center">
          <p className="mb-2 text-sm font-medium text-white drop-shadow-md">
            {scrollButtonText}
          </p>
          <button onClick={scrollToContent} className="group cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg" aria-label="Scroll to content" >
            <ChevronDown 
              className="h-6 w-6 text-gray-800 transition-transform duration-300 group-hover:translate-y-1" 
            />
          </button>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${ index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75' }`} aria-label={`Go to image ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;