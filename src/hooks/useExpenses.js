import { useState, useEffect, useCallback } from 'react';

/**
 * 경비 관리를 위한 커스텀 훅
 * @param {Object} initialExpenses - 초기 경비 데이터
 * @returns {Object} 경비 관련 상태와 함수들
 */
const useExpenses = (
  initialExpenses = {
    transportation: [
      { type: '가는편', amount: '' },
      { type: '오는편', amount: '' },
    ],
    accommodation: [
      { type: '1박 가격', amount: '' },
      { type: '인당 추가 요금', amount: '' },
    ],
    food: [{ name: '', amount: '' }],
    etc: [{ name: '', amount: '' }],
  },
) => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [newRow, setNewRow] = useState({
    transportation: null,
    accommodation: null,
    food: null,
    etc: null,
  });
  const [total, setTotal] = useState(0);
  const [selectedRow, setSelectedRow] = useState({
    category: null,
    index: null,
  });

  // 행 선택 처리
  const handleRowClick = useCallback((category, index) => {
    setSelectedRow((prev) =>
      prev.category === category && prev.index === index
        ? { category: null, index: null }
        : { category, index },
    );
  }, []);

  // 합계 계산 로직
  const calculateTotal = useCallback(() => {
    const newTotal = Object.entries(expenses).reduce(
      (sum, [category, items]) => {
        const categorySum = items.reduce((catSum, item) => {
          // 콤마 제거 후 숫자로 변환
          const amountStr = item.amount
            ? item.amount.toString().replace(/,/g, '')
            : '0';
          return catSum + (parseFloat(amountStr) || 0);
        }, 0);
        const newRowAmount = newRow[category]
          ? parseFloat(
              newRow[category].amount?.toString().replace(/,/g, '') || '0',
            )
          : 0;
        return sum + categorySum + newRowAmount;
      },
      0,
    );
    setTotal(newTotal);
  }, [expenses, newRow]);

  // 합계 자동 계산
  useEffect(() => {
    calculateTotal();
  }, [expenses, newRow, calculateTotal]);

  // 입력 필드 변경 처리
  const handleInputChange = useCallback((category, index, field, value) => {
    setExpenses((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }, []);

  // 금액 입력 필드 처리 (숫자만 허용, 포맷팅)
  const handleAmountChange = useCallback(
    (category, index, value) => {
      // 숫자만 입력 가능하도록 제한
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue === '') {
        handleInputChange(category, index, 'amount', '');
        return;
      }

      // 최대값 제한 (10억)
      if (parseInt(numericValue) > 1000000000) {
        return;
      }

      // 천 단위 콤마 추가
      const formattedValue = parseInt(numericValue).toLocaleString();
      handleInputChange(category, index, 'amount', formattedValue);
    },
    [handleInputChange],
  );

  // 새 행 입력 필드 변경 처리
  const handleNewRowInputChange = useCallback((category, field, value) => {
    // 금액 필드인 경우 숫자만 허용
    if (field === 'amount') {
      // 숫자만 입력 가능하도록 제한
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue === '') {
        setNewRow((prev) => ({
          ...prev,
          [category]: { ...prev[category], [field]: '' },
        }));
        return;
      }

      // 최대값 제한 (10억)
      if (parseInt(numericValue) > 1000000000) {
        return;
      }

      // 천 단위 콤마 추가
      const formattedValue = parseInt(numericValue).toLocaleString();
      setNewRow((prev) => ({
        ...prev,
        [category]: { ...prev[category], [field]: formattedValue },
      }));
    } else {
      setNewRow((prev) => ({
        ...prev,
        [category]: { ...prev[category], [field]: value },
      }));
    }
  }, []);

  // 새 행 추가 준비
  const addRow = useCallback((category) => {
    setNewRow((prev) => ({
      ...prev,
      [category]:
        category === 'food' || category === 'etc'
          ? { name: '', amount: '' }
          : { type: '', amount: '' },
    }));
  }, []);

  // 새 행 확정 추가
  const confirmNewRow = useCallback(
    (category) => {
      if (newRow[category]) {
        setExpenses((prev) => ({
          ...prev,
          [category]: [...prev[category], newRow[category]],
        }));
        setNewRow((prev) => ({ ...prev, [category]: null }));
      }
    },
    [newRow],
  );

  // 행 삭제
  const deleteRow = useCallback((category, index) => {
    setExpenses((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
    setSelectedRow({ category: null, index: null });
  }, []);

  // 드래그 앤 드롭 처리
  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const category = source.droppableId;

      const items = Array.from(expenses[category]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setExpenses((prev) => ({
        ...prev,
        [category]: items,
      }));
    },
    [expenses],
  );

  // 금액 포맷팅 (표시용)
  const formatNumber = useCallback((num) => {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  return {
    expenses,
    newRow,
    total,
    selectedRow,
    handleRowClick,
    handleInputChange,
    handleNewRowInputChange,
    handleAmountChange,
    addRow,
    confirmNewRow,
    deleteRow,
    handleDragEnd,
    formatNumber,
    setExpenses,
  };
};

export default useExpenses;
