import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../recoil/user';
import curationsAtom from '../recoil/curations';
import selectedCurationAtom from '../recoil/selectedCuration';
import Cookies from 'js-cookie';

export default function Curation({ curation, onClick }) {
  const user = useRecoilValue(userAtom);
  const setCurations = useSetRecoilState(curationsAtom);
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);

  const handleScrapClick = async event => {
    event.stopPropagation();
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const token = Cookies.get('accessToken');
      const method = curation.isScraped ? 'DELETE' : 'POST';
      await fetch(
        `http://localhost:8888/scraps/curations/${curation.curationId}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCurations(prev => {
        const updatedCurations = Array.isArray(prev) ? prev : [];
        return updatedCurations.map(updatedCuration =>
          updatedCuration.curationId === curation.curationId
            ? { ...updatedCuration, isScraped: !curation.isScraped }
            : updatedCuration,
        );
      });
      if (
        selectedCuration &&
        selectedCuration.curationId === curation.curationId
      ) {
        setSelectedCuration(prev => ({ ...prev, isScraped: !prev.isScraped }));
      }
    } catch (error) {
      console.error('Failed to update scrap status', error);
    }
  };

  return (
    <div className="container" onClick={onClick}>
      <div className="relative">
        <img
          src={curation.imgUrl || '../assets/img/icon.png'}
          className="object-cover w-full px-2 py-2 mx-auto h-64 opacity-70 rounded-2xl"
          alt={curation.title}
        />
        <div className="absolute text-lg text-[#FFFCF2] font-mixed font-extrabold bottom-3 left-7">
          {curation.title}
        </div>
        <BookmarkIcon
          className={`absolute top-5 right-5 w-5 h-5 stroke-white ${curation.isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={handleScrapClick}
        />
      </div>
    </div>
  );
}
