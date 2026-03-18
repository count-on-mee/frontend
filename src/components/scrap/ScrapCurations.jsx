import { useState } from 'react';
import { scrapListStyles } from '../../utils/style';

// 큐레이션 카드 컴포넌트
const CurationCard = ({ curation, onClick }) => (
  <div className={scrapListStyles.curationImage} onClick={onClick}>
    <img
      src={curation.imgUrl}
      alt={curation.name}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 right-0 p-2 text-right">
      <h4 className="text-white text-base sm:text-lg font-medium">
        {curation.name}
      </h4>
    </div>
  </div>
);

// 섹션 헤더 컴포넌트
const SectionHeader = ({ title }) => (
  <div className={scrapListStyles.sectionHeader}>
    <h3 className={scrapListStyles.sectionHeaderTitle}>{title}</h3>
  </div>
);

export default function ScrapCurations({
  curations,
  loading,
  error,
  onCurationClick,
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

  const handleSectionClick = () => {
    if (sectionHoverTimeout) {
      clearTimeout(sectionHoverTimeout);
      setSectionHoverTimeout(null);
    }
    setIsSectionHovered(true);
  };

  return (
    <div className="mt-8">
      <SectionHeader title="스크랩한 큐레이션" />
      <div
        className={
          isSectionHovered
            ? 'fixed inset-0 m-auto w-[90%] h-[90%] z-50 bg-background-gray rounded-lg shadow-2xl p-6 overflow-y-auto backdrop-blur-sm transition-all duration-1000 ease-out'
            : `${scrapListStyles.sectionContainer}`
        }
        onMouseEnter={handleSectionMouseEnter}
        onMouseLeave={handleSectionMouseLeave}
        onClick={handleSectionClick}
      >
        <div className="opacity-100 transition-opacity duration-1000 ease-out">
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : curations.length === 0 ? (
            <div className={scrapListStyles.emptyMessage}>
              스크랩한 큐레이션이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {(isSectionHovered ? curations : curations.slice(0, 6)).map(
                (curation) => (
                  <CurationCard
                    key={curation.curationId}
                    curation={curation}
                    onClick={() => onCurationClick(curation.curationId)}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
