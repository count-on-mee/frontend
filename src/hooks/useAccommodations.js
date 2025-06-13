import { useState, useEffect, useCallback, useRef } from 'react';

const useAccommodations = (initialAccommodations = []) => {
  // 기본 1행 placeholder
  const getDefaultAccommodation = () => ({
    tripDocumentAccommodationId: null,
    accommodation: '',
    checkInDate: '',
    checkOutDate: '',
    memo: '',
    isPlaceholder: true,
  });

  const [accommodations, setAccommodations] = useState(() =>
    initialAccommodations.length > 0 ? initialAccommodations : [],
  );
  const [newRow, setNewRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const initialRef = useRef(initialAccommodations);

  useEffect(() => {
    if (
      JSON.stringify(initialRef.current) !==
      JSON.stringify(initialAccommodations)
    ) {
      setAccommodations(
        initialAccommodations.length > 0 ? initialAccommodations : [],
      );
      initialRef.current = initialAccommodations;
    }
  }, [initialAccommodations]);

  // 행 선택 처리
  const handleRowClick = useCallback((index) => {
    setSelectedRow((prev) => (prev === index ? null : index));
  }, []);

  // 입력 필드 변경 처리
  const handleInputChange = useCallback((index, field, value) => {
    setAccommodations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }, []);

  // 새 행 입력 필드 변경 처리
  const handleNewRowInputChange = useCallback((fieldOrObj, value) => {
    setNewRow((prev) => {
      if (typeof fieldOrObj === 'object') {
        return { ...prev, ...fieldOrObj };
      }
      return { ...prev, [fieldOrObj]: value };
    });
  }, []);

  // 새 행 추가
  const confirmNewRow = useCallback(() => {
    if (
      newRow &&
      newRow.accommodation &&
      newRow.checkInDate &&
      newRow.checkOutDate
    ) {
      setAccommodations((prev) => [...prev, { ...newRow }]);
      setNewRow(null); // 입력 완료 후 newRow 초기화
    }
  }, [newRow]);

  // 행 삭제
  const deleteRow = useCallback((index) => {
    setAccommodations((prev) => prev.filter((_, i) => i !== index));
    setSelectedRow(null);
  }, []);

  // 수정 완료(blur)
  const finishEdit = useCallback(() => {
    setSelectedRow(null);
  }, []);

  // placeholder 행 노출 여부
  const displayAccommodations =
    accommodations.length === 0 && !newRow
      ? [getDefaultAccommodation()]
      : accommodations;

  return {
    accommodations: displayAccommodations,
    newRow,
    selectedRow,
    setSelectedRow,
    handleRowClick,
    handleInputChange,
    handleNewRowInputChange,
    confirmNewRow,
    deleteRow,
    setNewRow,
    finishEdit,
    setAccommodations,
  };
};

export default useAccommodations;
