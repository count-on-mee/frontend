import { renderToStaticMarkup } from 'react-dom/server';

export const createCategorySVGMarker = (IconComponent, bgColor = '#999') => {
  const iconSVG = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <circle cx="16" cy="16" r="16" fill={bgColor} />
      <foreignObject x="6" y="6" width="20" height="20">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {IconComponent && <IconComponent style={{ width: '16px', height: '16px' }} />}
        </div>
      </foreignObject>
    </svg>,
  );

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSVG)}`;
};
