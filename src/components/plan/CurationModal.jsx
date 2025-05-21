import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRecoilState } from 'recoil';
import selectedSpotsAtom from '../../recoil/selectedSpots';
import useCuration from '../../hooks/useCuration';
import clsx from 'clsx';
import {
  baseStyles,
  componentStyles,
  scrapListStyles,
  modalStyles,
} from '../../utils/style';

const SpotCard = ({ spot, isSelected, onToggleSelection }) => {
  return (
    <div className={scrapListStyles.spotCard}>
      <div className={scrapListStyles.imageContainer}>
        <img
          src={spot.imgUrls?.[0]}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={scrapListStyles.infoContainer}>
        <h3 className={scrapListStyles.name}>{spot.name}</h3>
        <p className={scrapListStyles.address}>{spot.address}</p>
        <button
          onClick={() => onToggleSelection(spot)}
          className={scrapListStyles.selectionButton(isSelected)}
        >
          {isSelected ? '선택' : '선택'}
        </button>
      </div>
    </div>
  );
};

const LoadingModal = () => (
  <div className={modalStyles.overlay}>
    <div className={modalStyles.container}>
      <div className="flex items-center justify-center h-full">
        <div className={modalStyles.spinner}></div>
      </div>
    </div>
  </div>
);

const ErrorModal = ({ error, onClose }) => (
  <div className={modalStyles.overlay}>
    <div className={modalStyles.container}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className={modalStyles.errorIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className={modalStyles.errorMessage}>
          큐레이션을 불러오는데 실패했습니다
        </h2>
        <p className={modalStyles.errorDescription}>{error}</p>
        <button onClick={onClose} className={modalStyles.errorCloseButton}>
          닫기
        </button>
      </div>
    </div>
  </div>
);

export default function CurationModal({ curationId, onClose }) {
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);
  const { curation, curationSpots, loading, error, fetchCuration } =
    useCuration(curationId);

  useEffect(() => {
    if (curationId) {
      fetchCuration(curationId);
    }
  }, [curationId]);

  const toggleSelection = (spot) => {
    setSelectedSpots((prev) => {
      const isSelected = prev.some((s) => s.spotId === spot.spotId);
      if (isSelected) {
        return prev.filter((s) => s.spotId !== spot.spotId);
      } else {
        return [...prev, spot];
      }
    });
  };

  if (loading) return <LoadingModal />;
  if (error) return <ErrorModal error={error} onClose={onClose} />;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        {/* 헤더 */}
        <div className={modalStyles.header}>
          <button onClick={onClose} className={modalStyles.closeButton}>
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2
            className={clsx(
              componentStyles.header,
              'absolute left-1/2 top-8 -translate-x-1/2',
            )}
          >
            {curation?.name || '큐레이션 상세'}
          </h2>
        </div>

        {/* 본문 */}
        <div className={modalStyles.content}>
          <div className={scrapListStyles.cardContainer}>
            {curationSpots.length === 0 ? (
              <div className={scrapListStyles.emptyMessage}>
                큐레이션에 포함된 장소가 없습니다.
              </div>
            ) : (
              <div className={scrapListStyles.grid}>
                {curationSpots.map((spot) => (
                  <SpotCard
                    key={spot.spotId}
                    spot={spot}
                    isSelected={selectedSpots.some(
                      (s) => s.spotId === spot.spotId,
                    )}
                    onToggleSelection={toggleSelection}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
