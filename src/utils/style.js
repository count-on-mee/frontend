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

  // placeholder 입력 필드
  placeholderInput: clsx(
    'w-full bg-[var(--color-background-gray)] rounded-full px-4 py-2 text-lg',
    'border-2 border-[var(--color-primary)] text-[var(--color-primary)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
    baseStyles.shadow,
    baseStyles.hoverShadow,
  ),

  // placeholder 셀
  placeholderCell: clsx(
    'p-3 rounded-full border-2 border-[var(--color-primary)] bg-white/60',
    'transition-colors duration-200',
  ),

  // 버튼 스타일
  button: {
    primary: 'px-6 py-2.5 bg-[#FF8C4B] text-white rounded-full font-medium',
    secondary: 'px-4 py-2 rounded-full text-lg font-semibold',
  },

  // 컨테이너 스타일
  container: {
    base: 'rounded-2xl p-3 py-4',
    card: 'rounded-2xl p-6',
  },

  // 텍스트 스타일
  text: {
    title: 'font-bold text-lg text-gray-800',
    subtitle: 'text-sm text-gray-500 mt-1',
    error: 'text-red-500',
    loading: 'text-gray-400',
  },
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
  // 기본 Neumorphism 스타일
  base: 'bg-[#f0f0f3] shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]',
  // 작은 Neumorphism 스타일
  small: 'bg-[#f0f0f3] shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]',
  // 작은 inset Neumorphism 스타일
  smallInset:
    'bg-[#f0f0f3] shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]',
  // 매우 작은 inset Neumorphism 스타일
  tinyInset:
    'bg-[#f0f0f3] shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff]',
  // hover 효과가 있는 Neumorphism 스타일
  hover:
    'hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-200',
};

/**
 * DateRangePicker 관련 스타일
 */
export const dateRangePickerStyles = {
  // 기본 버튼 스타일
  baseButton: (size) => {
    const sizeClasses = {
      small:
        'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 text-sm',
      default:
        'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 text-2xl',
    };
    return sizeClasses[size] || sizeClasses.default;
  },

  // 그림자 스타일
  baseShadow: 'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]',
  hoverShadow:
    'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',

  // 선택된 날짜 스타일
  selectedDate:
    'bg-primary text-white shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]',

  // 날짜 범위 내 스타일
  dateRange: 'bg-primary/30 text-primary',

  // 비활성화된 날짜 스타일
  disabledDate: 'text-gray-400 cursor-not-allowed shadow-none',

  // 오늘 날짜 스타일
  todayDate: 'text-red-500',

  // 현재 월의 날짜 스타일
  currentMonthDate:
    'text-gray-900 hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',

  // 다른 월의 날짜 스타일
  otherMonthDate: 'text-gray-400',

  // 네비게이션 버튼 스타일
  navButton: (size) => {
    const sizeClasses = {
      small:
        'flex items-center justify-center p-2 text-gray-400 hover:text-gray-500 transition-all duration-200 rounded-full',
      default:
        'flex items-center justify-center p-3 text-gray-400 hover:text-gray-500 transition-all duration-200 rounded-full',
    };
    return sizeClasses[size] || sizeClasses.default;
  },

  // 헤더 크기별 클래스
  headerSize: {
    small: {
      container: 'flex items-center p-4',
      month: 'block text-2xl text-[#EB5E28] drop-shadow-[3px_3px_6px_#b8b8b8]',
      year: 'block text-lg text-[#EB5E28] drop-shadow-[3px_3px_6px_#b8b8b8]',
      icon: 'w-5 h-5',
    },
    default: {
      container: 'flex items-center p-8',
      month: 'block text-7xl text-[#EB5E28] drop-shadow-[3px_3px_6px_#b8b8b8]',
      year: 'block text-3xl text-[#EB5E28] drop-shadow-[3px_3px_6px_#b8b8b8]',
      icon: 'w-8 h-8',
    },
  },

  // 그리드 크기별 클래스
  gridSize: {
    small: 'grid grid-cols-7 gap-2 px-4',
    default: 'grid grid-cols-7 gap-4 px-8',
  },

  // 요일 헤더 크기별 클래스
  dayHeaderSize: {
    small: 'text-sm leading-4 text-center font-medium text-gray-600',
    default: 'text-2xl leading-6 text-center font-medium text-gray-600',
  },

  // 완료 버튼 크기별 클래스
  completeButtonSize: {
    small:
      'w-full py-2 px-4 bg-primary text-white rounded-full hover:bg-[#D54E23] transition-all duration-200 text-sm shadow-[3px_3px_6px_#c44e1f,-3px_-3px_6px_#ff6c31] hover:shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]',
    default:
      'w-full py-4 px-6 bg-primary text-white rounded-full hover:bg-[#D54E23] transition-all duration-200 text-xl shadow-[3px_3px_6px_#c44e1f,-3px_-3px_6px_#ff6c31] hover:shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]',
  },

  // 완료 텍스트 크기별 클래스
  completeTextSize: {
    small: 'text-center text-gray-500 text-sm',
    default: 'text-center text-gray-500 text-xl',
  },

  // 컬럼 시작 위치 클래스
  colStart: [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
  ],
};

export const layoutStyles = {
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex justify-between items-center',
    gap: 'flex gap-4',
  },
  spacing: {
    section: 'mb-8',
    item: 'mb-4',
  },
};

export const animationStyles = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.5,
    },
  },
};

/**
 * ItineraryModal 관련 스타일
 */
export const itineraryModalStyles = {
  // 모달 배경
  modalBg: clsx(
    'fixed inset-0 w-screen h-screen bg-black/35 z-[2000]',
    'flex items-center justify-center overflow-hidden',
    'backdrop-blur-sm',
  ),

  // 모달 컨텐츠
  modalContent: clsx(
    'min-w-[700px] max-w-[90vw] max-h-[90vh] overflow-auto',
    'bg-[#f8f8fa] rounded-[24px] relative p-10',
    'shadow-[0_8px_32px_rgba(0,0,0,0.18)]',
    'flex flex-col items-center',
    'border border-white/20',
  ),

  // 날짜 컨테이너
  dateContainer: clsx('flex justify-center gap-6 mb-6 w-full'),

  // 날짜 박스
  dateBox: clsx(
    'px-6 py-3 rounded-[16px] bg-[#f0f0f3]',
    'font-semibold text-lg text-[#252422]',
    'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]',
    'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',
    'transition-all duration-200',
  ),

  // 일정 컨테이너
  itineraryContainer: clsx(
    'flex flex-row gap-6 w-full justify-start mt-6',
    'overflow-x-auto pb-4 min-w-full',
    'scrollbar-thin scrollbar-thumb-[#FF8C4B] scrollbar-track-[#f0f0f3]',
  ),

  // 일정 카드
  itineraryCard: clsx(
    'min-w-[220px] flex-shrink-0 bg-[#f8f8fa]',
    'rounded-xl p-4 flex flex-col items-center',
    'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]',
    'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',
    'transition-all duration-200',
  ),

  // 일정 제목
  itineraryTitle: clsx(
    'text-xl font-bold mb-2 text-[#252422]',
    'flex items-center gap-2',
  ),

  // 일정 날짜
  itineraryDate: clsx('text-[#FF8C4B] font-medium text-base'),

  // 일정 리스트
  itineraryList: clsx('min-h-[40px] w-full space-y-2'),

  // 일정 아이템
  itineraryItem: clsx(
    'bg-white rounded-lg p-3',
    'text-base flex items-center justify-between',
    'transition-all duration-200',
    'shadow-[2px_2px_4px_#b8b8b8,-2px_-2px_4px_#ffffff]',
    'hover:shadow-[inset_2px_2px_4px_#b8b8b8,inset_-2px_-2px_4px_#ffffff]',
    'hover:bg-[#f8f8fa]',
    'group',
  ),

  // 삭제 버튼
  deleteButton: clsx(
    'ml-2 text-[#FF8C4B] bg-none border-none',
    'font-semibold cursor-pointer',
    'opacity-0 group-hover:opacity-100',
    'transition-all duration-200',
    'hover:text-[#D54E23]',
  ),

  // 드래그 오버레이
  dragOverlay: clsx(
    'p-3 bg-white rounded-lg',
    'text-base opacity-90',
    'shadow-[4px_4px_8px_#b8b8b8,-4px_-4px_8px_#ffffff]',
    'border border-[#FF8C4B]/20',
  ),

  // 버튼 컨테이너
  buttonContainer: clsx('mt-8 text-center flex gap-4 justify-center'),

  // 완료 버튼
  completeButton: clsx(
    'min-w-[180px] text-xl py-3.5 rounded-xl',
    'bg-[#FF8C4B] text-white font-bold',
    'shadow-[3px_3px_6px_#c44e1f,-3px_-3px_6px_#ff6c31]',
    'hover:shadow-[inset_3px_3px_6px_#c44e1f,inset_-3px_-3px_6px_#ff6c31]',
    'hover:bg-[#D54E23]',
    'transition-all duration-200',
    'border-none cursor-pointer',
  ),

  // 취소 버튼
  cancelButton: clsx(
    'min-w-[100px] text-base rounded-lg',
    'bg-[#f0f0f3] text-[#666] font-medium',
    'shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]',
    'hover:shadow-[inset_3px_3px_6px_#b8b8b8,inset_-3px_-3px_6px_#ffffff]',
    'hover:text-[#252422]',
    'transition-all duration-200',
    'border-none py-2.5 cursor-pointer',
  ),
};

export default {
  baseStyles,
  componentStyles,
  styleUtils,
  scrapListStyles,
  modalStyles,
  searchStyles,
  neumorphStyles,
  dateRangePickerStyles,
  layoutStyles,
  animationStyles,
  itineraryModalStyles,
};
