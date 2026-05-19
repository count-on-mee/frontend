import { useState, useEffect, useCallback, useRef } from 'react';

const useAccommodations = (initialAccommodations = []) => {
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
      setAccommodations((prev) => {
        if (prev.length === 0 || prev.every((item) => item.isPlaceholder)) {
          return initialAccommodations.length > 0 ? initialAccommodations : [];
        }

        const initialIds = new Set(
          initialAccommodations
            .map((item) => item.tripDocumentAccommodationId)
            .filter((id) => id !== null && id !== undefined),
        );

        const existingIds = new Set(
          prev
            .map((item) => item.tripDocumentAccommodationId)
            .filter((id) => id !== null && id !== undefined),
        );

        const newAccommodations = initialAccommodations.filter(
          (item) => !existingIds.has(item.tripDocumentAccommodationId),
        );

        const updatedPrev = prev
          .map((item) => {
            if (item.isPlaceholder || !item.tripDocumentAccommodationId) {
              return item;
            }
            if (!initialIds.has(item.tripDocumentAccommodationId)) {
              return null;
            }
            const updated = initialAccommodations.find(
              (init) =>
                init.tripDocumentAccommodationId ===
                item.tripDocumentAccommodationId,
            );
            if (!updated) {
              return item;
            }
            const localStr = JSON.stringify(item);
            const serverStr = JSON.stringify(updated);

            if (localStr === serverStr) {
              return updated;
            }

            const merged = { ...updated };
            Object.keys(item).forEach((key) => {
              if (key === 'isPlaceholder') return;
              const localValue = item[key];
              const serverValue = updated[key];

              if (
                localValue !== serverValue &&
                localValue !== '' &&
                localValue !== null &&
                localValue !== undefined
              ) {
                merged[key] = localValue;
              }
            });

            return merged;
          })
          .filter((item) => item !== null);

        return [...updatedPrev, ...newAccommodations];
      });
      initialRef.current = initialAccommodations;
    }
  }, [initialAccommodations]);

  const handleRowClick = useCallback((index) => {
    setSelectedRow((prev) => (prev === index ? null : index));
  }, []);

  const handleInputChange = useCallback((index, field, value) => {
    setAccommodations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }, []);

  const handleNewRowInputChange = useCallback((fieldOrObj, value) => {
    setNewRow((prev) => {
      if (typeof fieldOrObj === 'object') {
        return { ...prev, ...fieldOrObj };
      }
      return { ...prev, [fieldOrObj]: value };
    });
  }, []);

  const confirmNewRow = useCallback(() => {
    if (
      newRow &&
      newRow.accommodation &&
      newRow.checkInDate &&
      newRow.checkOutDate
    ) {
      setAccommodations((prev) => [...prev, { ...newRow }]);
      setNewRow(null);
    }
  }, [newRow]);

  const deleteRow = useCallback((index) => {
    setAccommodations((prev) => prev.filter((_, i) => i !== index));
    setSelectedRow(null);
  }, []);

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
    setAccommodations,
  };
};

export default useAccommodations;
