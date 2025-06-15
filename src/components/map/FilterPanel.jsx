import categories_map from '../../utils/categoriesMap';

export default function FilterPanel({ onFilter, activeCategories }) {
  return (
    <div className="pt-3 absolute top-2 left-3 z-40">
      {categories_map.map((category) => {
        if (category.key == '여행') return null;
        const isActive = activeCategories.includes(category.key);
        const Icon = category.icon;
        return (
          <button
            key={category.key}
            onClick={() => onFilter(category.key)}
            className={`inline-flex items-center mr-3 py-1 px-2 rounded-full text-sm font-medium ${isActive ? 'bg-primary' : 'bg-charcoal'} text-background-light box-shadow`}
          >
            <Icon alt={category.label} className="size-5 gap-1 pr-1" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
