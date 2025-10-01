import { XMarkIcon } from '@heroicons/react/24/outline';
import defaultImage from '../../assets/icon.png';
import { neumorphStyles } from '../../utils/style';

export default function SpotCart({ spots, onDelete }) {
  return (
    <div className="space-y-3">
      {spots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>선택된 스팟이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {spots.map((spot, index) => {
            // 수정 모드에서는 uniqueId 또는 spotId를, 생성 모드에서는 spotScrapId를 사용
            const identifier = spot.uniqueId || spot.spotId || spot.spotScrapId;

            return (
              <div
                key={identifier}
                className={`flex items-center space-x-3 p-3 rounded-xl ${neumorphStyles.small} ${neumorphStyles.hover}`}
              >
                <div className="flex-shrink-0">
                  <span className="w-8 h-8 bg-[#EB5E28] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
                <img
                  src={spot.imgUrls?.[0] || spot.imgUrl || defaultImage}
                  alt={spot.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#252422] truncate">
                    {spot.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {spot.address}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(identifier)}
                  className={`p-2 rounded-full transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
                >
                  <XMarkIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
