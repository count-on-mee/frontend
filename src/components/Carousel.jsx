import React, { useState }  from 'react';

function Carousel ({ images }) { 
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transfrom duration-500 translate-x-full"
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img 
              src={image} 
              alt={`spot ${index}`}
              className="w-full h-auto object-cover"
            />
           </div> 
        ))}
      </div>

    </div>
  )

}


     




