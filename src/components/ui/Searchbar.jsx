import { searchStyles } from '../../utils/style';
import clsx from 'clsx';

export default function Searchbar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search',
  className = '',
  size = 'sm', // 'sm', 'md', 'lg', 'xl' 중 하나
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  const sizeStyles = {
    sm: 'text-sm py-1.5',
    md: 'text-base py-2',
    lg: 'text-lg py-2.5',
    xl: 'text-xl py-3',
  };

  const iconSizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const containerStyles = {
    sm: 'h-9',
    md: 'h-10',
    lg: 'h-11',
    xl: 'h-12',
  };

  return (
    <form
      className={clsx(searchStyles.container, containerStyles[size], className)}
      onSubmit={handleSubmit}
      method="get"
    >
      <div className="relative w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx(searchStyles.icon, iconSizeStyles[size])}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          className={clsx(searchStyles.input, sizeStyles[size], 'h-full')}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </form>
  );
}
