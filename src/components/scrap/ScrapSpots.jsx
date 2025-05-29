import { scrapListStyles } from '../../utils/style';
import defaultImage from '../../assets/icon.png';

// 스팟 카드 컴포넌트
const SpotCard = ({ spot, isSelected, onToggleSelection }) => (
  <div className={scrapListStyles.spotCard}>
    <div className={scrapListStyles.imageContainer}>
      <img
        src={spot.imgUrls?.[0] || defaultImage}
        alt={spot.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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

// 섹션 헤더 컴포넌트
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
  return (
    <div className="mt-8">
      <SectionHeader title="스크랩한 장소" />
      <div className={scrapListStyles.sectionContainer}>
        <div className="group-hover:opacity-100 opacity-100 transition-opacity duration-500">
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
