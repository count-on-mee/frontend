import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';
import defaultImage from '../../assets/icon.png';
import { useNavigate } from 'react-router-dom';
import { animationStyles } from '../../utils/style';

function MyPageScrap() {
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [scrapedCurations, setScrapedCurations] = useState([]);
  const [visibleSpotCount, setVisibleSpotCount] = useState(3);
  const [visibleCurationCount, setVisibleCurationCount] = useState(5);

  const navigate = useNavigate();

  const fetchScrapedSpots = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/scraps/spots', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setScrapedSpots(data);
    } catch (error) {
      console.error('Failed to fetch scraped spots:', error);
    }
  };

  const fetchScrapedCurations = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/scraps/curations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setScrapedCurations(data);
    } catch (error) {
      console.error('Failed to fetch scraped curations:', error);
    }
  };

  useEffect(() => {
    fetchScrapedSpots();
    fetchScrapedCurations();
  }, []);

  const handleSpotScrap = async (event, spotId) => {
    event.stopPropagation();
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.delete(`/scraps/spots/${spotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchScrapedSpots();
    } catch (error) {
      console.error('스크랩 취소 에러:', error);
    }
  };

  const handleCurationScrap = async (event, curationId) => {
    event.stopPropagation();
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.delete(`/scraps/curations/${curationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchScrapedCurations();
    } catch (error) {
      console.error('스크랩 취소 에러:', error);
    }
  };

  const handleShowMoreSpot = () => {
    setVisibleSpotCount((prev) => prev + 3);
  };

  const handleShowMoreCuration = () => {
    setVisibleCurationCount((prev) => prev + 5);
  };

  return (
    <>
      <motion.div
        className="w-full px-6 py-8"
        initial="hidden"
        animate="visible"
        variants={animationStyles.listContainer}
      >
        <motion.div
          className="px-4 py-6 mx-auto font-mixed text-3xl text-center text-[#252422] font-bold"
          variants={animationStyles.title}
        >
          SPOT
        </motion.div>
        {scrapedSpots.length > 0 && (
          <motion.div
            className="grid grid-cols-3 gap-5"
            variants={animationStyles.listContainer}
          >
            <AnimatePresence mode="popLayout">
              {scrapedSpots.slice(0, visibleSpotCount).map((spot) => (
                <motion.div
                  key={spot.spotScrapId}
                  variants={animationStyles.listItem}
                  layout
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="relative mx-3 cursor-pointer"
                    onClick={() => navigate(`/spot/${spot.spotId}?from=scrap`)}
                    whileHover={animationStyles.hover}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <img
                      src={spot.imgUrls || defaultImage}
                      alt={spot.title}
                      className="relative object-cover flex mt-2 rounded-md w-full aspect-16/9"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BookmarkIcon
                        className={`absolute top-3 right-3 w-5 h-5 ${spot.isDeleted ? '' : 'fill-[#EB5E28] stroke-[#EB5E28]'}`}
                        onClick={(event) => handleSpotScrap(event, spot.spotId)}
                      />
                    </motion.div>
                  </motion.div>
                  <div
                    className="w-56 font-light truncate font-mixed text-md cursor-pointer"
                    onClick={() => navigate(`/spot/${spot.spotId}?from=scrap`)}
                  >
                    {spot.name}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div></div>
            {visibleSpotCount < scrapedSpots.length && (
              <motion.button
                onClick={handleShowMoreSpot}
                className="w-30 text-bold mx-auto bg-background-gray box-shadow py-2 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                더보기
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        className="w-full px-6 py-8"
        initial="hidden"
        animate="visible"
        variants={animationStyles.listContainer}
      >
        <motion.div
          className="px-4 py-6 mx-auto font-mixed text-3xl text-center text-[#252422] font-bold"
          variants={animationStyles.title}
        >
          CURATION
        </motion.div>
        {scrapedCurations.length > 0 && (
          <motion.div
            className="grid grid-cols-5 gap-2 w-full"
            variants={animationStyles.listContainer}
          >
            <AnimatePresence mode="popLayout">
              {scrapedCurations
                .slice(0, visibleCurationCount)
                .map((curation) => (
                  <motion.div
                    key={curation.curationScrapId}
                    variants={animationStyles.listItem}
                    layout
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.div
                      className="relative cursor-pointer"
                      onClick={() =>
                        navigate(`/curation/${curation.curationId}`)
                      }
                      whileHover={animationStyles.hover}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <img
                        src={curation.imgUrl}
                        alt={curation.name}
                        className="relative object-cover flex mt-2 rounded-md w-full aspect-3/4"
                      />
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <BookmarkIcon
                          className={`absolute top-3 right-3 w-5 h-5 ${curation.isDeleted ? '' : 'fill-[#EB5E28] stroke-[#EB5E28]'}`}
                          onClick={(event) =>
                            handleCurationScrap(event, curation.curationId)
                          }
                        />
                      </motion.div>
                      <div className="absolute font-bold text-white truncate font-mixed left-2 bottom-1 text-md text-shadow">
                        {curation.name}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
            </AnimatePresence>
            <div></div>
            <div></div>
            {visibleCurationCount < scrapedCurations.length && (
              <motion.button
                onClick={handleShowMoreCuration}
                className="w-30 mx-auto text-bold bg-background-gray box-shadow py-2 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                더보기
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

export default MyPageScrap;
