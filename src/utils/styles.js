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
  buttonStyle: (isConfirm = false, isDisabled = false) =>
    clsx(
      baseStyles.button,
      baseStyles.shadow,
      isConfirm
        ? isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[var(--color-primary)] text-white hover:bg-[#D54E23]'
        : 'bg-[var(--color-background-gray)] hover:bg-[#E0DFDE]',
      'px-4 py-2 text-lg font-semibold',
      baseStyles.hoverShadow,
    ),

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

export default {
  baseStyles,
  componentStyles,
  styleUtils,
};
