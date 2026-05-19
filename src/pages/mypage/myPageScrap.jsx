import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import api from '../../utils/axiosInstance';
import defaultImage from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function MyPageScrap() {
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [scrapedCurations, setScrapedCurations] = useState([]);
  const [visibleSpotCount, setVisibleSpotCount] = useState(9);
  const [visibleCurationCount, setVisibleCurationCount] = useState(6);
  const navigate = useNavigate();

  const fetchScrapedSpots = async () => {
    try {
      const res = await api.get('/scraps/spots');
      setScrapedSpots(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchScrapedCurations = async () => {
    try {
      const res = await api.get('/scraps/curations');
      setScrapedCurations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchScrapedSpots();
    fetchScrapedCurations();
  }, []);

  const handleSpotScrap = async (e, spotId) => {
    e.stopPropagation();
    try {
      await api.delete(`/scraps/spots/${spotId}`);
      fetchScrapedSpots();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCurationScrap = async (e, curationId) => {
    e.stopPropagation();
    try {
      await api.delete(`/scraps/curations/${curationId}`);
      fetchScrapedCurations();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full">
      <section className="mb-6">
        <h2 className="text-[13px] font-semibold text-charcoal/50 uppercase tracking-wider mb-3 px-1">
          Spot
        </h2>

        {scrapedSpots.length === 0 ? (
          <p className="text-sm text-charcoal/40 text-center py-6">
            스크랩한 Spot이 없습니다
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-0.5">
              <AnimatePresence mode="popLayout">
                {scrapedSpots.slice(0, visibleSpotCount).map((spot) => (
                  <motion.div
                    key={spot.spotScrapId}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square cursor-pointer group"
                    onClick={() => navigate(`/spot/${spot.spotId}?from=scrap`)}
                  >
                    <img
                      src={spot.imgUrls || defaultImage}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      className="absolute top-1.5 right-1.5 z-10"
                      onClick={(e) => handleSpotScrap(e, spot.spotId)}
                    >
                      <BookmarkIcon className="w-4 h-4 fill-primary stroke-primary drop-shadow" />
                    </button>
                    <p className="absolute bottom-1 left-1.5 right-1.5 text-[10px] text-white font-medium truncate drop-shadow">
                      {spot.name}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {visibleSpotCount < scrapedSpots.length && (
              <button
                onClick={() => setVisibleSpotCount((p) => p + 9)}
                className="mt-3 w-full text-[13px] text-charcoal/60 py-2 border border-charcoal/15 rounded-xl hover:bg-charcoal/5 transition-colors"
              >
                더 보기
              </button>
            )}
          </>
        )}
      </section>
      <section>
        <h2 className="text-[13px] font-semibold text-charcoal/50 uppercase tracking-wider mb-3 px-1">
          Curation
        </h2>

        {scrapedCurations.length === 0 ? (
          <p className="text-sm text-charcoal/40 text-center py-6">
            스크랩한 Curation이 없습니다
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <AnimatePresence mode="popLayout">
                {scrapedCurations
                  .slice(0, visibleCurationCount)
                  .map((curation) => (
                    <motion.div
                      key={curation.curationScrapId}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-[3/4] cursor-pointer rounded-lg overflow-hidden group"
                      onClick={() =>
                        navigate(`/curation/${curation.curationId}`)
                      }
                    >
                      <img
                        src={curation.imgUrl || defaultImage}
                        alt={curation.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <button
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) =>
                          handleCurationScrap(e, curation.curationId)
                        }
                      >
                        <BookmarkIcon className="w-4 h-4 fill-primary stroke-primary drop-shadow" />
                      </button>
                      <p className="absolute bottom-2 left-2 right-2 text-[11px] text-white font-semibold truncate">
                        {curation.name}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {visibleCurationCount < scrapedCurations.length && (
              <button
                onClick={() => setVisibleCurationCount((p) => p + 6)}
                className="mt-3 w-full text-[13px] text-charcoal/60 py-2 border border-charcoal/15 rounded-xl hover:bg-charcoal/5 transition-colors"
              >
                더 보기
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default MyPageScrap;
