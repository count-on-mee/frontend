import categories_map from '../../utils/categoriesMap';

export default function Hashtag({ category, varient }) {
  const categoryArray = Array.isArray(category) ? category : [category];

  const isCuration = varient === 'curation';

  return (
    <div className={`gap-2 ${isCuration ? '' : 'px-5'} pt-3`}>
      {categoryArray.map((categoryKey) => {
        const categoryInfo = categories_map.find(
          (cat) => cat.key === categoryKey,
        );
        if (!categoryInfo) return null;
        const Icon = categoryInfo.icon;
        return (
          <div
            key={categories_map.key}
            className={`inline-flex items-center mr-1 px-2 rounded-full text-sm font-medium ${isCuration ? 'bg-primary/90' : 'bg-background-gray'} text-charcoal box-shadow`}
          >
            <Icon alt={categoryInfo.label} className="size-5 gap-1 pr-1" />
            {categoryInfo.label}
          </div>
        );
      })}
    </div>
  );
}
