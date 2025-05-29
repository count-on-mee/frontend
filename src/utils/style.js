import clsx from 'clsx';

/**
 * 기본 스타일 정의
 */
export const baseStyles = {
  button:
    'flex items-center justify-center rounded-full transition-all duration-200',
  shadow: 'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]',
  hoverShadow:
    'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',
  insetShadow: 'shadow-[inset_1px_1px_2px_#b8b8b8,inset_-1px_-1px_2px_#ffffff]',
};

/**
 * 공통으로 컴포넌트
 */
export const componentStyles = {
  // 입력 필드
  input: clsx(
    'w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
    baseStyles.shadow,
    baseStyles.hoverShadow,
  ),

  // 헤더
  header: clsx(
    'inline-block px-4 py-2 rounded-full font-bold text-lg',
    'bg-[var(--color-background-gray)] text-[#252422]',
    baseStyles.shadow,
  ),

  // 카테고리
  category: clsx(
    'inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full text-lg font-semibold',
    'bg-[var(--color-background-gray)]',
    baseStyles.shadow,
    'text-[var(--color-primary)]',
  ),

  // 셀
  cell: clsx(
    'p-3 rounded-full transition-colors duration-200',
    'hover:bg-[#E0DFDE]/50',
  ),

  // 카테고리 구분선
  divider: clsx(
    'h-1 my-3 bg-[var(--color-background-gray)] rounded-full',
    baseStyles.insetShadow,
  ),

  // 삭제 버튼
  deleteButton: clsx(
    'text-[var(--color-primary)] hover:text-[#D54E23] transition-colors duration-200',
    'p-2 flex items-center justify-center w-8 h-8 rounded-full',
    'bg-[var(--color-background-gray)]',
    baseStyles.shadow,
    baseStyles.hoverShadow,
  ),
};

/**
 * 동적으로 조건부 함수들
 */
export const styleUtils = {
  // 버튼 스타일 생성
  buttonStyle: (isConfirm = false, isDisabled = false, size = 'md') => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    return clsx(
      baseStyles.button,
      baseStyles.shadow,
      isConfirm
        ? isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[var(--color-primary)] text-white hover:bg-[#D54E23]'
        : 'bg-[var(--color-background-gray)] hover:bg-[#E0DFDE]',
      sizeStyles[size],
      'font-semibold',
      baseStyles.hoverShadow,
    );
  },

  // 행 추가 버튼
  addButtonStyle: clsx(
    baseStyles.button,
    baseStyles.shadow,
    'w-full mt-2 py-3 text-[#252422] hover:bg-[#E0DFDE] text-lg',
    'flex items-center justify-center gap-2',
    baseStyles.hoverShadow,
    'bg-[var(--color-background-gray)]',
  ),

  // 완료 버튼
  confirmButtonStyle: clsx(
    baseStyles.button,
    baseStyles.shadow,
    'w-full mt-2 py-3 text-white text-lg',
    'flex items-center justify-center gap-2',
    baseStyles.hoverShadow,
    'bg-[var(--color-primary)] hover:bg-[#D54E23]',
  ),

  // 행 스타일 생성
  rowStyle: (isSelected, isDragging, isFixedRow, isNewRow) =>
    clsx('hover:bg-[#E0DFDE]/50 transition-colors duration-200', {
      'cursor-move': !isFixedRow && !isNewRow,
      'cursor-default': isFixedRow || isNewRow,
      'bg-[#E0DFDE]': isDragging,
      'bg-[#E0DFDE]/80': isSelected,
    }),
};

/**
 * MyScrapListPage 관련 스타일
 */
export const scrapListStyles = {
  // 스팟 항목
  spotItem: clsx(
    'border-b border-[#252422] bg-[var(--color-background-gray)]',
    'px-5 py-4 text-sm',
    'transition-all duration-700',
  ),

  // 이미지 컨테이너
  imageContainer: clsx(
    'aspect-square w-full rounded-lg overflow-hidden',
    'transition-all duration-700',
    'relative group',
  ),

  // 스팟 카드
  spotCard: clsx(
    'rounded-lg overflow-hidden',
    'transition-all duration-700',
    'hover:shadow-lg',
    'flex flex-col',
    baseStyles.shadow,
    baseStyles.hoverShadow,
  ),

  // 섹션 컨테이너
  sectionContainer: clsx(
    'relative transition-all duration-700',
    'group',
    'hover:fixed hover:inset-0 hover:m-auto hover:w-[90%] hover:h-[90%] hover:z-50',
    'hover:bg-background-gray hover:rounded-lg hover:shadow-2xl',
    'hover:p-6 hover:overflow-y-auto',
    'hover:scale-[1.01]',
    baseStyles.shadow,
  ),

  // 큐레이션 이미지
  curationImage: clsx(
    'w-full aspect-[3/4] rounded-lg overflow-hidden cursor-pointer',
    'transition-all duration-700 ease-in-out hover:scale-102',
    baseStyles.shadow,
    'hover:shadow-xl relative',
  ),

  // 선택 버튼
  selectionButton: (isSelected) =>
    clsx(
      baseStyles.button,
      baseStyles.shadow,
      isSelected
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-[var(--color-background-gray)] text-[#252422]',
      'px-3 py-1 text-sm font-semibold',
      baseStyles.hoverShadow,
    ),

  // 여행 시작 버튼
  startTripButton: clsx(
    baseStyles.button,
    baseStyles.shadow,
    'bg-[var(--color-primary)] text-white font-semibold',
    'py-3 px-8 hover:bg-[#D54E23]',
    'transition-colors duration-300',
    baseStyles.hoverShadow,
  ),

  // 섹션 헤더
  sectionHeader: clsx(
    'top-0 bg-background-gray py-4 mb-6 border-b border-gray-200 z-10',
  ),
  sectionHeaderTitle: clsx('text-lg sm:text-xl font-semibold text-[#252422]'),

  // 검색 입력 필드
  searchInput: clsx(componentStyles.input, 'h-9 pl-10 pr-4'),

  // 스팟 그리드
  grid: clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3'),

  // 스팟 카드 컨테이너
  cardContainer: clsx('bg-background-gray rounded-lg p-6 shadow-lg'),

  // 빈 상태 메시지
  emptyMessage: clsx('text-center py-8 text-gray-500'),

  // 스팟 정보 컨테이너
  infoContainer: clsx('p-2 sm:p-3 pb-0'),

  // 스팟 이름
  name: clsx('font-medium text-sm sm:text-base mb-1'),

  // 스팟 주소
  address: clsx('text-gray-600 text-xs sm:text-sm mb-2'),
};

/**
 * 모달 관련 스타일
 */
export const modalStyles = {
  // 모달 오버레이
  overlay: clsx(
    'fixed inset-0 z-50 flex items-center justify-center',
    'bg-background/70',
  ),

  // 모달 컨테이너
  container: clsx(
    'relative z-10 bg-background-gray rounded-lg shadow-xl',
    'w-full max-w-7xl h-[calc(100vh-8rem)]',
    'flex flex-col',
    baseStyles.shadow,
  ),

  // 모달 헤더
  header: clsx(
    'relative pt-8 pb-8 px-8 border-b border-gray-200',
    'flex-shrink-0',
  ),

  // 모달 컨텐츠
  content: clsx('flex-1 overflow-y-auto', 'p-8'),

  // 모달 닫기 버튼
  closeButton: clsx(
    baseStyles.button,
    baseStyles.shadow,
    baseStyles.hoverShadow,
    'p-2 sm:p-3 absolute left-8 top-8',
  ),

  // 로딩
  spinner: clsx(
    'animate-spin rounded-full h-12 w-12',
    'border-t-2 border-b-2 border-[var(--color-primary)]',
  ),

  // 에러 아이콘
  errorIcon: clsx('w-16 h-16 mb-4 text-red-500'),

  // 에러 메시지
  errorMessage: clsx('text-xl font-bold mb-2'),

  // 에러 설명
  errorDescription: clsx('text-gray-600 mb-4'),

  // 에러 닫기 버튼
  errorCloseButton: clsx(
    baseStyles.button,
    baseStyles.shadow,
    'px-4 py-2 rounded-full text-white font-medium',
    'bg-[var(--color-primary)] hover:bg-[#D54E23]',
    'transition-colors duration-200',
  ),
};

/**
 * 검색바 관련 스타일
 */
export const searchStyles = {
  container: clsx(
    'w-full relative',
    baseStyles.shadow,
    'rounded-full overflow-hidden',
    'h-12',
  ),
  input: clsx(
    'w-full bg-[var(--color-background-gray)]',
    'pl-12 pr-3',
    'focus:outline-none',
    'text-[#252422]',
    'text-lg',
    'h-full',
  ),
  icon: clsx(
    'absolute left-4 top-1/2 -translate-y-1/2',
    'text-[#252422]',
    'w-6 h-6',
  ),
};

export const neumorphStyles = {
  container: clsx(
    'bg-background-gray',
    'rounded-2xl',
    'p-6 sm:p-8',
    'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]',
    'hover:shadow-[6px_6px_12px_rgba(0,0,0,0.12),-6px_-6px_12px_rgba(255,255,255,0.9)]',
    'transition-all duration-300 ease-in-out',
  ),
  button: clsx(
    'bg-background-gray',
    'rounded-full',
    'px-6 py-3',
    'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]',
    'hover:shadow-[6px_6px_12px_rgba(0,0,0,0.12),-6px_-6px_12px_rgba(255,255,255,0.9)]',
    'active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]',
    'transition-all duration-300 ease-in-out',
    'text-gray-700',
    'font-medium',
  ),
  input: clsx(
    'bg-background-gray',
    'rounded-xl',
    'px-4 py-3',
    'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]',
    'focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.12),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]',
    'transition-all duration-300 ease-in-out',
    'w-full',
    'outline-none',
    'text-gray-700',
  ),
  card: clsx(
    'bg-background-gray',
    'rounded-xl',
    'p-4',
    'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]',
    'hover:shadow-[6px_6px_12px_rgba(0,0,0,0.12),-6px_-6px_12px_rgba(255,255,255,0.9)]',
    'transition-all duration-300 ease-in-out',
  ),
  icon: clsx('w-6 h-6', 'text-gray-600', 'transition-colors duration-200'),
};

export default {
  baseStyles,
  componentStyles,
  styleUtils,
  scrapListStyles,
  modalStyles,
  searchStyles,
  neumorphStyles,
};
