import React, { useState } from 'react';
import { PlusCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';

const UploadImages = ({ mode = 'single', onUpload }) => {
  const [images, setImages] = useState([]);
  const [isDragover, setIsDragOver] = useState(false);

  const handleAddImages = (e) => {
    const selectedImages = Array.from(e.target.files);

    if (mode === 'single') {
      const singleImage = selectedImages[0];
      setImages([singleImage]);
      onUpload([singleImage]);
    } else if (mode === 'multiple') {
      const limitedImages = selectedImages.slice(0, 15);
      if (selectedImages.length > 15) {
        alert(
          '최대 15장까지 업로드할 수 있습니다. 초과된 이미지는 제외됩니다.',
        );
      }
      setImages(limitedImages);
      onUpload(limitedImages);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedImages = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    );
    const limitedImages = droppedImages.slice(0, 15);
    if (droppedImages.length > 15) {
      alert('최대 15장까지 업로드할 수 있습니다. 초과된 이미지는 제외됩니다.');
    }
    setImages(limitedImages);
    onUpload(limitedImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="">
      {mode === 'single' ? (
        <button>
          <label className="relative flex items-center justify-center">
            <PlusCircleIcon className="w-10 h-10" />
            <input
              className="hidden"
              type="file"
              multiple={mode === 'single'}
              onChange={handleAddImages}
              accept="image/*"
            />
          </label>
        </button>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`${isDragover ? 'bg-gray-200' : ''}`}
        >
          <label className="inline-flex flex-col justify-center w-full h-90 text-center text-gray-300 cursor-pointer">
            <PhotoIcon className="w-20 h-20 mx-auto" />
            <p className="p-5">
              파일을 이곳에 드래그하거나 클릭하여 업로드하세요.
            </p>
            <input
              type="file"
              multiple={mode === 'multiple'}
              onChange={handleAddImages}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadImages;
