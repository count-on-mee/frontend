import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const UploadImages = ({ className, mode = 'single', onUpload }) => {
  const [images, setImages] = useState([]);

  const handleAddImages = (event) => {
    const selectedImages = Array.from(event.target.files);

    

    if (mode === 'single') {
      setImages([selectedImages[0]]); 
    } else if (mode === 'multiple') {
        setImages(selectedImages); 
    }

    if (onUpload) {
      onUpload(selectedImages);
    }
  };

  return (
    <div className={className}> 
      <button>
        <label className="relative">
          <PlusCircleIcon 
      className="w-1/5 h-1/5" />
          <input
            className="hidden"
            type="file"
            multiple={mode === 'multiple'}
            onChange={handleAddImages}
            accept="image/*"
          />
        </label>
     
      </button>
    </div>
  );
};

export default UploadImages;