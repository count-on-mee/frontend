import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { useState }  from 'react';
import defaultImage from '../assets/img/icon.png'

function Carousel ({ imgUrls, spot }) { 
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = (event) => {
    event.stopPropagation();
    const newIndex = currentIndex === 0 ? imgUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = (event) => {
    event.stopPropagation();
    const newIndex = currentIndex === imgUrls.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)`}}
      >
        {imgUrls.length > 0 ? (
           imgUrls.map((url, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={url || defaultImage} 
                alt={`${spot.title}`}
                className="w-72 h-36 object-cover rounded-md mx-auto"
              />
            </div> 
          ))
        ) : (
            <div>
              <img 
                src="../src/assets/img/icon.png"
                className="opacity-70 w-72 h-36 object-cover border rounded-md"
              />
            </div>
        )}
      </div>
      <button 
        onClick={handlePrevious}      className="absolute top-1/2 left-1 transfrom -translate-y-1/2 bg-white/30 p-2 rounded-full"
      >
        <ChevronLeftIcon 
          onClick={handlePrevious}
          className="w-5 h-5 stroke-black"/>
      </button>
      <button 
        onClick={handleNext}
        className="absolute top-1/2 right-1 transfrom -translate-y-1/2 bg-white/30 p-2 rounded-full"
      >
        <ChevronRightIcon 
          onClick={handleNext}
          className="w-5 h-5"/>
      </button>
    </div>
  )
}

export default Carousel;

