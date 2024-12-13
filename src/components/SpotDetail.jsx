import Spot from './Spot';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import UploadImages from './UploadImages';
import Photodump from './Photodump';

export default function SpotDetail({ selectedSpot, setSelectedSpot }) {
  const handleClose = () => {
    setSelectedSpot(null);
  };

  const handleUpload = (files) => {
    const newPhotoURLs = Array.from(files).map(file => URL.createObjectURL(file));
    const updatedPhotos = selectedSpot.photos ? [...selectedSpot.photos, newPhotoURLs] : newPhotoURLs;
    setSelectedSpot({...selectedSpot, photos: updatedPhotos});
  }

  return (
    <div className="bg-[#FFFCF2] w-full h-screen border-r-2 border-[#403D39] overflow-y-auto pb-[88px]">
        <div className="sticky top-0 bg-[#FFFCF2] z-10 flex justify-between">
          <div className="">
            <button
              onClick={handleClose}
              className=""
            >
              <ChevronLeftIcon 
                className='w-7 h-7 m-3'
              />
            </button>
          </div>
          <div className="font-mixed font-semibold text-lg my-3 block truncate">{selectedSpot.title}</div>
          <div className="">
            <button onClick={handleClose}>
              <XMarkIcon className="w-7 h-7 m-3" />
            </button>
          </div>
        </div>  
        {selectedSpot && <Spot spot={selectedSpot} />}
  
      <div className="flex justify-between items-center p-5">
        <div className="font-prompt text-xl mr-5">Photos</div>
        <UploadImages
          mode = 'multiple' 
          className="mx-auto"
          onUpload={handleUpload}
        />
      </div>  
      <div className="grid grid-cols-2 p-2 gap-2">
        {(!selectedSpot.photos || selectedSpot.photos.length === 0) && (
          <>
            <div className="w-full h-52 border border-[#403D39] flex rounded-md bg-white justify-center items-center">
             <img
               src='../src/assets/img/logo.png'
               className= "w-full px-2"
             />
            </div>
            <div className="w-full h-52 border border-[#403D39] flex rounded-md bg-white justify-center items-center">
              <img
                src='../src/assets/img/logo.png'
                className= "w-full px-2"
              />
            </div>
          </>
        )}
        { selectedSpot.photos &&
          // <div key={index}>
          //   <img
          //     src={photo}
          //     alt={`Spot ${index}`}
          //     className="w-full h-52 object-cover border border-[#403D39] rounded-md" 
          //   />
          // </div>
          <Photodump selectedSpot={selectedSpot} photos={selectedSpot.photos} />
        }
        
       

       
      </div>
    </div>
  );
}
