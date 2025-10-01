import { useRecoilState } from 'recoil';
import Curation from './Curation';
import selectedCurationAtom from '../../recoil/selectedCuration';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { animationStyles } from '../../utils/style';

export default function CurationList({
  handleScrapClick,
  onSelectedCuration,
  curations,
  searchTerm = '',
}) {
  const [selectedCuration, setSelectedCuration] =
    useRecoilState(selectedCurationAtom);

  const EmptyState = ({ isSearch = false }) => (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="mb-8">
        {isSearch ? (
          <div className="mx-auto mb-6">
            <MagnifyingGlassIcon className="w-24 h-24 text-gray-400" />
          </div>
        ) : (
          <div className="mx-auto mb-6">
            <PlusIcon className="w-24 h-24 text-gray-400" />
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {isSearch ? '검색 결과가 없습니다' : '아직 큐레이션이 없어요'}
      </h3>

      <p className="text-gray-600 mb-8 max-w-md leading-relaxed whitespace-pre-line">
        {isSearch
          ? `"${searchTerm}"에 대한 검색 결과를 찾을 수 없습니다.\n다른 키워드로 검색해보세요.`
          : '다양한 여행지의 큐레이션을 둘러보거나\n나만의 큐레이션을 만들어보세요!'}
      </p>

      {!isSearch && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            큐레이션 둘러보기
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {curations.length === 0 ? (
        <EmptyState isSearch={searchTerm.length > 0} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {curations.map((curation, index) => (
            <motion.div
              key={curation.curationId}
              custom={index}
              variants={animationStyles.gridItem}
              initial="hidden"
              animate="visible"
              whileHover={animationStyles.hover}
              whileTap={animationStyles.tap}
            >
              <Curation
                curation={curation}
                handleScrapClick={handleScrapClick}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectedCuration(curation);
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
