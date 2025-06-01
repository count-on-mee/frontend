import Searchbar from '../components/ui/Searchbar';
import CurationList from '../components/curation/CurationList';
import CurationDetail from '../components/curation/CurationDetail';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import selectedCurationAtom from '../recoil/selectedCuration';
import selectedCurationSpotAtom from '../recoil/selectedCurationSpot';
import CurationUploader from '../components/curation/CurationUploader';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import authAtom from '../recoil/auth';
import curationsAtom from '../recoil/curations';
import { getRecoil } from 'recoil-nexus';
import api from '../utils/axiosInstance';
import userAtom from '../recoil/user';

export default function CurationPage() {
  const [curations, setCurations] = useRecoilState(curationsAtom);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );
  const [isUploaderOpen, setIsUploaderOpen] = useState(null);
  const curation = selectedCuration;
  const user = useRecoilValue(userAtom);

  const fetchCuration = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/curations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log(data);
      setCurations(data);
    } catch (error) {
      console.error('Failed to fetch curation:', error);
    }
  };

  useEffect(() => {
    fetchCuration();
    console.log(curations);
  }, []);

  const handleScrapClick = async (event, curation) => {
    event.stopPropagation();
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (!curation) {
      console.warn('curation이 null입니다.');
      return;
    }

    // console.log(curation);

    try {
      const token = getRecoil(authAtom).accessToken;
      const method = curation.isScraped ? 'DELETE' : 'POST';
      await api({
        url: `/scraps/curations/${curation.curationId}`,
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurations((prev) => {
        const updatedCurations = Array.isArray(prev) ? prev : [];
        return updatedCurations.map((updatedCuration) =>
          updatedCuration.curationId === curation.curationId
            ? { ...updatedCuration, isScraped: !curation.isScraped }
            : updatedCuration,
        );
      });
      if (
        selectedCuration &&
        selectedCuration.curationId === curation.curationId
      ) {
        setSelectedCuration((prev) => ({
          ...prev,
          isScraped: !prev.isScraped,
        }));
      }
    } catch (error) {
      console.error('Failed to update scrap status', error);
    }
  };

  return (
    <div className="w-full">
      {!selectedCuration ? (
        <div>
          <div className="w-1/2 mb-4 mt-6 ml-5">
            <Searchbar size="lg" />
          </div>
          {/* curationList */}
          <div className="">
            <CurationList handleScrapClick={handleScrapClick} />
          </div>
        </div>
      ) : (
        // curationDetail
        <div>
          <CurationDetail
            selectedCuration={selectedCuration}
            setSelectedCuration={setSelectedCuration}
          />
          {selectedCurationSpot && (
            <div>
              <SpotDetail />
            </div>
          )}
          <div className="flex-1">
            <Map />
          </div>
        </div>
      )}
      {/* curationUploader */}
      <div className="fixed bottom-5 right-5">
        <button
          className="flex z-50 p-3 text-xl font-bold bg-background-light box-shadow rounded-2xl text-charcoal px-2 hover:bg-primary hover:text-background-light hover:p-5"
          onClick={() => setIsUploaderOpen(true)}
        >
          <FaRegPenToSquare className="mx-1 my-1" />
          <div>Curation 만들기</div>
        </button>
      </div>
      <CurationUploader
        isOpen={isUploaderOpen}
        // selectedSpot={selectedSpot}
        // setSelectedSpot={setSelectedSpot}
        onClose={() => setIsUploaderOpen(false)}
        // fetchPhotoDump={fetchPhotoDump}
      />
    </div>
  );
}
