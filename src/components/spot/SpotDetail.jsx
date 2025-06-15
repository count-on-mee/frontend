import Spot from './Spot';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ReviewUploader from './ReviewUploader';
import PhotoDump from './PhotoDump';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';

export default function SpotDetail({
  selectedSpot,
  setSelectedSpot,
  handleSpotScrap,
}) {
  const [photoDump, setPhotoDump] = useState([]);
  const spot = selectedSpot;
  // console.log(spot);

  const fetchPhotoDump = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api(`spots/${spot.spotId}/reviews`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.data;
      // console.log(data);
      setPhotoDump(data);
    } catch (error) {
      console.error('Failed to fetch photo dump:', error);
    }
  };

  useEffect(() => {
    if (spot.spotId) {
      fetchPhotoDump();
      // console.log(photoDump);
    }
  }, [spot?.spotId]);

  const handleClose = () => {
    setSelectedSpot(null);
  };
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  // console.log(selectedSpot);
  return (
    <div>
      <div className="sticky top-0 z-10 flex justify-between bg-background-light">
        <div className="">
          <button onClick={handleClose} className="">
            <ChevronLeftIcon className="w-7 h-7 m-3" />
          </button>
        </div>
        <div className="font-mixed font-semibold text-lg my-3 block truncate">
          {selectedSpot.name}
        </div>
        <div className="">
          <button onClick={handleClose}>
            <XMarkIcon className="w-7 h-7 m-3" />
          </button>
        </div>
      </div>
      <Spot
        varient="detail"
        spot={selectedSpot}
        handleScrapClick={handleSpotScrap}
      />
      <div className="mx-5 mt-10 flex justify-between">
        <div className="text-lg font-bold">후기</div>
        <button
          className="flex bg-background-light box-shadow rounded-2xl text-charcoal px-2 hover:bg-primary hover:text-background-light"
          onClick={() => setIsUploaderOpen(true)}
        >
          <FaRegPenToSquare className="mx-1 my-1" />
          <div>후기 등록</div>
        </button>
      </div>
      <ReviewUploader
        isOpen={isUploaderOpen}
        selectedSpot={selectedSpot}
        setSelectedSpot={setSelectedSpot}
        onClose={() => setIsUploaderOpen(false)}
        fetchPhotoDump={fetchPhotoDump}
      />
      <div>
        <PhotoDump
          selectedSpot={selectedSpot}
          photoDump={photoDump}
          setPhotoDump={setPhotoDump}
        />
      </div>

      {/* <div>관련된 큐레이션</div> */}
    </div>
  );
}
