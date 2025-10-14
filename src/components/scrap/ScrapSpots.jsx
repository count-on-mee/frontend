import { useState } from 'react';
import { scrapListStyles } from '../../utils/style';
import defaultImage from '../../assets/icon.png';

const SpotCard = ({ spot, isSelected, onToggleSelection }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsHovered(true);
    }, 1500);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(false);
  };

  return (
    <div
      className={scrapListStyles.spotCard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={scrapListStyles.imageContainer}>
        <img
          src={spot.imgUrls?.[0] || defaultImage}
          alt={spot.name}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-800 ease-out ${
            isHovered ? 'opacity-20' : 'opacity-0'
          }`}
        ></div>
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

const SectionHeader = ({ title }) => (
  <div className={scrapListStyles.sectionHeader}>
    <h3 className={scrapListStyles.sectionHeaderTitle}>{title}</h3>
  </div>
);

export default function ScrapSpots({
  spots,
  loading,
  error,
  selectedSpots,
  onToggleSelection,
}) {
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [sectionHoverTimeout, setSectionHoverTimeout] = useState(null);

  const handleSectionMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsSectionHovered(true);
    }, 2000);
    setSectionHoverTimeout(timeout);
  };

  const handleSectionMouseLeave = () => {
    if (sectionHoverTimeout) {
      clearTimeout(sectionHoverTimeout);
      setSectionHoverTimeout(null);
    }
    setIsSectionHovered(false);
  };

  return (
    <div className="mt-8">
      <SectionHeader title="스크랩한 장소" />
      <div
        className={
          isSectionHovered
            ? 'fixed inset-0 m-auto w-[90%] h-[90%] z-50 bg-background-gray rounded-lg shadow-2xl p-6 overflow-y-auto backdrop-blur-sm transition-all duration-1000 ease-out'
            : `${scrapListStyles.sectionContainer}`
        }
        onMouseEnter={handleSectionMouseEnter}
        onMouseLeave={handleSectionMouseLeave}
      >
        <div className="opacity-100 transition-opacity duration-1000 ease-out">
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : spots.length === 0 ? (
            <div className={scrapListStyles.emptyMessage}>
              스크랩한 장소가 없습니다.
            </div>
          ) : (
            <div className={scrapListStyles.grid}>
              {spots.map((spot) => (
                <SpotCard
                  key={spot.spotId}
                  spot={spot}
                  isSelected={selectedSpots.some(
                    (s) => s.spotId === spot.spotId,
                  )}
                  onToggleSelection={onToggleSelection}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
