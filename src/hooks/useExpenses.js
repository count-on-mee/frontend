import { useState, useEffect, useCallback, useRef } from 'react';

const useExpenses = (
  initialExpenses = {
    transportation: [{ tripDocumentExpenseId: null, type: '', amount: '' }],
    accommodation: [{ tripDocumentExpenseId: null, type: '', amount: '' }],
    food: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
    etc: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
  },
) => {
  // 초기 데이터가 올바른 형태인지 확인하고 기본값 설정
  const getDefaultExpenses = () => ({
    transportation: [{ tripDocumentExpenseId: null, type: '', amount: '' }],
    accommodation: [{ tripDocumentExpenseId: null, type: '', amount: '' }],
    food: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
    etc: [{ tripDocumentExpenseId: null, name: '', amount: '' }],
  });

  const validateExpenses = (expenses) => {
    if (!expenses || typeof expenses !== 'object') {
      return getDefaultExpenses();
    }

    const requiredCategories = [
      'transportation',
      'accommodation',
      'food',
      'etc',
    ];
    const validated = {};

    requiredCategories.forEach((category) => {
      if (Array.isArray(expenses[category])) {
        validated[category] = expenses[category];
      } else {
        validated[category] =
          category === 'food' || category === 'etc'
            ? [{ tripDocumentExpenseId: null, name: '', amount: '' }]
            : [
                {
                  tripDocumentExpenseId: null,
                  type: category === 'transportation' ? '수단명' : '숙소명',
                  amount: '',
                },
              ];
      }
    });

    return validated;
  };

  const [expenses, setExpenses] = useState(() =>
    validateExpenses(initialExpenses),
  );
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

  const initialExpensesRef = useRef(initialExpenses);

  // 초기 데이터가 변경될 때 expenses 상태 업데이트
  useEffect(() => {
    const validatedExpenses = validateExpenses(initialExpenses);

    const currentExpensesStr = JSON.stringify(expenses);
    const newExpensesStr = JSON.stringify(validatedExpenses);
    const previousInitialStr = JSON.stringify(initialExpensesRef.current);

    if (
      newExpensesStr !== previousInitialStr &&
      currentExpensesStr !== newExpensesStr
    ) {
      setExpenses(validatedExpenses);
      initialExpensesRef.current = initialExpenses;
    }
  }, [initialExpenses, expenses]);

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
        // items가 배열인지 확인
        if (!Array.isArray(items)) {
          console.warn(
            `Items for category ${category} is not an array:`,
            items,
          );
          return sum;
        }

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
  }, [calculateTotal]);

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
          ? { tripDocumentExpenseId: null, name: '', amount: '' }
          : { tripDocumentExpenseId: null, type: '', amount: '' },
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
    setExpenses((prev) => {
      const filteredExpenses = prev[category].filter((_, i) => i !== index);

      // 각 카테고리에 최소 1개 기본행
      if (filteredExpenses.length === 0) {
        if (category === 'food' || category === 'etc') {
          filteredExpenses.push({
            tripDocumentExpenseId: null,
            name: '',
            amount: '',
          });
        } else {
          const defaultType =
            category === 'transportation' ? '수단명' : '숙소명';
          filteredExpenses.push({
            tripDocumentExpenseId: null,
            type: defaultType,
            amount: '',
          });
        }
      }

      return {
        ...prev,
        [category]: filteredExpenses,
      };
    });
    setSelectedRow({ category: null, index: null });
  }, []);

  // 드래그 앤 드롭 처리
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const category = source.droppableId;

    setExpenses((prev) => {
      const items = Array.from(prev[category]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      return {
        ...prev,
        [category]: items,
      };
    });
  }, []);

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
