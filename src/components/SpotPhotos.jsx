import { useState, useRef } from 'react';
import SpotPhotoModal from './SpotPhotoModal';
import { useRecoilValue } from 'recoil';
import spotsAtom  from '../recoil/spot';

export default function SpotPhotos({ photo, selectedSpot,setSelectedSpot }) {
  const [modalOpen, setModalOpen] = useState(false);
  const[selectedSpotPhoto, setSelectedSpotPhoto] = useState(null);

  const openModal = (spotphotos) => { 
  setModalOpen(true);};

  const closeModal = () => {
    setModalOpen(false);
  }

  const handleSelectSpotPhoto = (photo) => setSelectedSpotPhoto(photo);

  return (
    <>
      <div>
        <img 
          key={photo.id}
          src={photo.image|| '../src/assets/img/logo.png'}
          className="w-full h-48 opacity-70 object-scale-down"
          alt={photo.description || 'Spot image'}
        />
      </div>  
          
      {selectedSpotPhoto && (
        <SpotPhotoModal 
          photo={selectedSpotPhoto}
          closeModal={() => setSelectedSpotPhoto(null)}
        />
      )}
    </>
  )
}
