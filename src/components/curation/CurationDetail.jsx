import { useRecoilState, useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import Curation from './Curation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import selectedCurationSpotAtom from '../../recoil/selectedCurationSpot';
import { withCenter } from '../../recoil/selectedCurationSpot';
import defaultImage from '../../assets/logo.png';
import Hashtag from '../ui/Hashtag';
import { neumorphStyles, animationStyles } from '../../utils/style';

export default function CurationDetail({
  selectedCuration,
  setSelectedCuration,
  handleScrapClick,
}) {
  const [selectedCurationSpot, setSelectedCurationSpot] = useRecoilState(
    selectedCurationSpotAtom,
  );
  const setSelectedCurationSpotWithCenter = useSetRecoilState(withCenter);

  const handleSelectSpot = (spot) => {
    setSelectedCurationSpot(spot);
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-full bg-[#f0f0f3] overflow-y-auto">
        <div className="p-6">
          {/* 뒤로가기  */}
          <motion.button
            onClick={() => {
              setSelectedCuration(null);
              setSelectedCurationSpot(null);
            }}
            className={`mb-4 p-2 rounded-full ${neumorphStyles.small} ${neumorphStyles.hover}`}
            {...animationStyles.backButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeftIcon className="w-6 h-6 text-[#252422]" />
          </motion.button>

          {/* 큐레이션 정보 */}
          <motion.div
            className="mb-6"
            variants={animationStyles.slideUp}
            initial="hidden"
            animate="visible"
          >
            <Curation
              className="mb-4"
              curation={selectedCuration}
              handleScrapClick={handleScrapClick}
              varient="detail"
            />
          </motion.div>

          {/* 설명  */}
          <motion.div
            className={`mb-6 ${neumorphStyles.base} rounded-2xl p-6 transition-all duration-200`}
            variants={animationStyles.slideUp}
            initial="hidden"
            animate="visible"
          >
            <Hashtag
              category={selectedCuration.categories}
              varient="curation"
            />
            <p className="mt-4 text-[#252422] text-base leading-relaxed">
              {selectedCuration.description}
            </p>
          </motion.div>

          {/* 스팟 목록 */}
          <motion.div
            className="space-y-4"
            variants={animationStyles.listContainer}
            initial="hidden"
            animate="visible"
          >
            {selectedCuration.spots.map((spot, index) => (
              <motion.div
                key={spot.spotId}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectSpot(spot);
                  setSelectedCurationSpotWithCenter(spot);
                }}
                className={`${neumorphStyles.small} ${neumorphStyles.hover} rounded-2xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-4`}
                variants={animationStyles.listItem}
                whileHover={animationStyles.subtleHover}
                whileTap={animationStyles.subtleTap}
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-semibold text-sm">
                  {index + 1}
                </span>
                <img
                  src={spot.imgUrls.length > 0 ? spot.imgUrls[0] : defaultImage}
                  className="flex-shrink-0 w-12 h-12 object-cover rounded-full"
                  alt={spot.name}
                />
                <p className="text-sm font-semibold text-[#252422] flex-1">
                  {spot.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
