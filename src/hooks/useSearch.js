import { useState, useCallback, useMemo } from 'react';

/**
 * 일반 검색 훅
 * @param {Array} items - 검색할 아이템 배열
 * @param {string|Array} searchFields - 검색할 필드 (문자열 또는 배열)
 * @param {Object} options - 추가 옵션
 * @param {number} options.maxResults - 최대 결과 수 (자동완성 모드에서만 사용)
 * @param {boolean} options.isAutocomplete - 자동완성 모드 여부
 * @returns {Object} 검색 관련 상태와 핸들러
 */
export const useSearch = (items, searchFields = 'name', options = {}) => {
  const { maxResults = 5, isAutocomplete = false } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 검색어 변경 핸들러
  const handleSearch = useCallback((value) => {
    setSearchTerm(value || ''); // undefined나 null이 들어오면 빈 문자열로 변환
  }, []);

  // 검색 필드가 문자열인 경우 배열로 변환
  const fields = Array.isArray(searchFields) ? searchFields : [searchFields];

  // 검색 결과 필터링
  const filteredItems = useMemo(() => {
    if (!searchTerm || typeof searchTerm !== 'string')
      return isAutocomplete ? [] : items;

    const searchTermLower = searchTerm.toLowerCase();
    const results = items.filter((item) => {
      // 모든 지정된 필드에서 검색
      return fields.some((field) => {
        const value = item[field];
        if (!value) return false;

        // 문자열이 아닌 경우 문자열로 변환
        const searchValue = String(value).toLowerCase();
        return searchValue.includes(searchTermLower);
      });
    });

    // 자동완성 모드인 경우 결과 수 제한
    return isAutocomplete ? results.slice(0, maxResults) : results;
  }, [items, searchTerm, fields, isAutocomplete, maxResults]);

  return {
    searchTerm,
    handleSearch,
    filteredItems,
    isLoading,
    setSearchTerm,
  };
};

/**
 * 장소 검색 훅 (주소, 이름, 설명 등)
 * @param {Array} spots - 장소 배열
 * @returns {Object} 검색 관련 상태와 핸들러
 */
export const useSpotSearch = (spots) => {
  return useSearch(spots, ['name', 'address', 'description'], {
    isAutocomplete: true,
    maxResults: 5,
  });
};

/**
 * 일반 목록 검색 훅 (이름만)
 * @param {Array} items - 검색할 아이템 배열
 * @returns {Object} 검색 관련 상태와 핸들러
 */
export const useListSearch = (items) => {
  return useSearch(items, 'name', {
    isAutocomplete: false,
  });
};

/**
 * 다중 필드 검색 훅
 * @param {Array} items - 검색할 아이템 배열
 * @param {Array} fields - 검색할 필드 배열
 * @returns {Object} 검색 관련 상태와 핸들러
 */
export const useMultiFieldSearch = (items, fields) => {
  return useSearch(items, fields, {
    isAutocomplete: false,
  });
};
