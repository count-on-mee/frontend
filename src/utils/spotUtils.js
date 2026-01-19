/**
 * 단일 spot 데이터 포맷팅
 * @param {Object} spotData 
 * @returns {Object} 
 */
export const formatSpotData = (spotData) => {
  return {
    ...spotData,
    position: {
      lat: spotData.location?.lat || spotData.position?.lat,
      lng: spotData.location?.lng || spotData.position?.lng,
    },
    imgUrls: spotData.imgUrls || [],
    categories: spotData.categories || [],
  };
};

/**
 * 여러 spot 데이터 포맷팅
 * @param {Array} spotsData 
 * @returns {Array} 
 */
export const formatSpotsData = (spotsData) => {
  return spotsData.map((spot) => formatSpotData(spot));
};
