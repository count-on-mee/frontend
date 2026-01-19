import { XMarkIcon } from '@heroicons/react/24/outline';
import defaultImage from '../../assets/logo.png';
import { neumorphStyles } from '../../utils/style';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSpotItem({ spot, index, onDelete }) {
  const identifier = spot.uniqueId || spot.spotId || spot.spotScrapId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: identifier });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'shadow-lg border-2 border-[#EB5E28]'
          : `${neumorphStyles.small} ${neumorphStyles.hover}`
      }`}
      {...attributes}
      {...listeners}
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
        <p className="font-medium text-[#252422] truncate">{spot.name}</p>
        <p className="text-sm text-gray-500 truncate">{spot.address}</p>
      </div>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(identifier);
        }}
        className={`p-2 rounded-full transition-colors ${neumorphStyles.small} ${neumorphStyles.hover}`}
      >
        <XMarkIcon className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

export default function SpotCart({ spots, onDelete, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = spots.findIndex(
        (spot) =>
          (spot.uniqueId || spot.spotId || spot.spotScrapId) === active.id,
      );
      const newIndex = spots.findIndex(
        (spot) =>
          (spot.uniqueId || spot.spotId || spot.spotScrapId) === over.id,
      );

      const newSpots = arrayMove(spots, oldIndex, newIndex);
      onReorder(newSpots);
    }
  };

  return (
    <div className="space-y-3">
      {spots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>선택된 스팟이 없습니다</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={spots.map(
              (spot) => spot.uniqueId || spot.spotId || spot.spotScrapId,
            )}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {spots.map((spot, index) => (
                <SortableSpotItem
                  key={spot.uniqueId || spot.spotId || spot.spotScrapId}
                  spot={spot}
                  index={index}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
