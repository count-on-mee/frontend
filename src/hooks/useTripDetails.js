import { useState, useEffect, useCallback, useRef } from 'react';
import useSocket from './useSocket';
import axiosInstance from '../utils/axiosInstance';

const DEFAULT_STATISTICS = {
  shared: {
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
  },
  personal: {
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
  },
};

const extractSettlementFromResponse = (data) => {
  const document = data?.document || {};
  const activeVersion = data?.activeVersion || {};
  const version = data?.version || {};
  return (
    activeVersion.settlement ??
    data?.settlement ??
    document.settlement ??
    version.settlement ??
    undefined
  );
};

const normalizeTripDocumentResponse = (
  data,
  selectedVersionIdOverride = null,
) => {
  const document = data?.document || {};
  const versions = document.versions || data?.versions || [];
  const activeVersion = data?.activeVersion || {};
  const resolvedActiveVersionId =
    document.activeVersionId || activeVersion.tripDocumentVersionId || null;
  const resolvedSelectedVersionId =
    selectedVersionIdOverride ||
    activeVersion.tripDocumentVersionId ||
    resolvedActiveVersionId;

  const hasExpenses =
    activeVersion?.expenses !== undefined || data?.expenses !== undefined;
  const hasStatistics =
    activeVersion?.statistics !== undefined || data?.statistics !== undefined;
  const hasSettlement =
    activeVersion?.settlement !== undefined ||
    data?.settlement !== undefined ||
    document?.settlement !== undefined ||
    data?.version?.settlement !== undefined;

  return {
    document,
    versions,
    activeVersionId: resolvedActiveVersionId,
    selectedVersionId: resolvedSelectedVersionId,
    hasExpenses,
    hasStatistics,
    hasSettlement,
    expenses: hasExpenses
      ? activeVersion.expenses || data?.expenses || []
      : undefined,
    statistics: hasStatistics
      ? activeVersion.statistics || data?.statistics || DEFAULT_STATISTICS
      : undefined,
    settlement: hasSettlement
      ? (extractSettlementFromResponse(data) ?? null)
      : undefined,
    accommodations: data?.accommodations || [],
    tasks: data?.tasks || [],
    participantCount: document.participantCount || 1,
    tripStartDate: document.startDate || null,
  };
};

const useTripDetails = (tripId) => {
  const {
    socket,
    isConnected,
    isConnecting,
    error: socketError,
  } = useSocket(tripId);

  const [expenses, setExpenses] = useState([]);
  const [statistics, setStatistics] = useState({
    shared: {
      totalBudget: 0,
      totalSpent: 0,
      remainingBudget: 0,
    },
    personal: {
      totalBudget: 0,
      totalSpent: 0,
      remainingBudget: 0,
    },
  });
  const [accommodations, setAccommodations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersionId, setActiveVersionId] = useState(null);
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeVersionIdRef = useRef(null);
  useEffect(() => {
    activeVersionIdRef.current = activeVersionId;
  }, [activeVersionId]);

  const selectedVersionIdRef = useRef(null);
  useEffect(() => {
    selectedVersionIdRef.current = selectedVersionId;
  }, [selectedVersionId]);

  const applyTripDocumentResponse = useCallback(
    (data, selectedVersionIdOverride = null) => {
      const normalized = normalizeTripDocumentResponse(
        data,
        selectedVersionIdOverride,
      );
      const tripStartDateStr = normalized.tripStartDate
        ? new Date(normalized.tripStartDate).toISOString().slice(0, 10)
        : null;

      const expenseList = normalized.expenses ?? [];
      const newExpenses = expenseList.map((expense) => {
        if (!expense.expenseDate || expense.expenseDate === '') {
          return {
            ...expense,
            expenseDate: '1970-01-01',
          };
        }

        if (tripStartDateStr && expense.expenseDate === tripStartDateStr) {
          if (expense.expenseCategory === 'BUDGET') {
            return {
              ...expense,
              expenseDate: '1970-01-01',
            };
          }
        }

        return expense;
      });

      setDocument(normalized.document);
      setVersions((prev) =>
        normalized.versions && normalized.versions.length > 0
          ? normalized.versions
          : prev,
      );
      setActiveVersionId((prev) => normalized.activeVersionId || prev);
      setSelectedVersionId(normalized.selectedVersionId);
      if (normalized.hasExpenses) {
        setExpenses(newExpenses);
      }
      if (normalized.hasStatistics) {
        setStatistics(normalized.statistics);
      }
      if (selectedVersionIdOverride != null) {
        setSettlement(extractSettlementFromResponse(data) ?? null);
      } else if (normalized.hasSettlement) {
        setSettlement(normalized.settlement);
      }
      setTasks(normalized.tasks);
      setParticipantCount(normalized.participantCount);

      setAccommodations((prev) => {
        const newAccommodations = normalized.accommodations;
        if (prev.length === 0) {
          return newAccommodations;
        }

        const existingIds = new Set(
          prev
            .map((item) => item.tripDocumentAccommodationId)
            .filter((id) => id !== null && id !== undefined),
        );

        const toAdd = newAccommodations.filter(
          (item) => !existingIds.has(item.tripDocumentAccommodationId),
        );

        const updated = prev.map((item) => {
          if (!item.tripDocumentAccommodationId) {
            return item;
          }
          const serverItem = newAccommodations.find(
            (newItem) =>
              newItem.tripDocumentAccommodationId ===
              item.tripDocumentAccommodationId,
          );
          return serverItem || item;
        });

        return [...updated, ...toAdd];
      });
    },
    [],
  );

  const fetchTripData = useCallback(async () => {
    if (!tripId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/trips/${tripId}/documents`);
      applyTripDocumentResponse(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [tripId, applyTripDocumentResponse]);

  const fetchTripVersion = useCallback(
    async (
      tripDocumentVersionId,
      { emitSocket = false, isNew = false } = {},
    ) => {
      if (!tripId || !tripDocumentVersionId) {
        return;
      }
      setSelectedVersionId(tripDocumentVersionId);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/trips/${tripId}/documents/versions/${tripDocumentVersionId}`,
        );
        applyTripDocumentResponse(response.data, tripDocumentVersionId);

        if (emitSocket && socket?.connected) {
          socket.emit('changeVersion', { tripDocumentVersionId, isNew });
        }
      } catch (err) {
        setError(err);
      }
    },
    [tripId, applyTripDocumentResponse, socket],
  );

  const refetchCurrentVersion = useCallback(
    async (versionIdOverride = null) => {
      const targetVersionId =
        versionIdOverride ?? activeVersionId ?? selectedVersionId;
      if (targetVersionId) {
        await fetchTripVersion(targetVersionId);
        return;
      }
      await fetchTripData();
    },
    [selectedVersionId, activeVersionId, fetchTripVersion, fetchTripData],
  );

  const renameTripVersion = useCallback(
    async (tripDocumentVersionId, name) => {
      if (!tripId || !tripDocumentVersionId || !name?.trim()) {
        return;
      }

      await axiosInstance.patch(
        `/trips/${tripId}/documents/versions/${tripDocumentVersionId}`,
        { name: name.trim() },
      );
      setVersions((prev) =>
        prev.map((v) =>
          v.tripDocumentVersionId === tripDocumentVersionId
            ? { ...v, name: name.trim() }
            : v,
        ),
      );
    },
    [tripId],
  );

  const createInterimSettlementVersion = useCallback(async () => {
    if (!tripId) {
      return;
    }

    const res = await axiosInstance.post(
      `/trips/${tripId}/documents/versions`,
      {
        reason: 'INTERIM_SETTLEMENT',
      },
    );
    const newVersionId =
      res.data?.tripDocumentVersionId ??
      res.data?.versionId ??
      res.data?.tripDocumentVersion?.tripDocumentVersionId ??
      null;

    await fetchTripData();
    if (newVersionId) {
      await fetchTripVersion(newVersionId, { emitSocket: true, isNew: true });
    }
  }, [tripId, fetchTripData, fetchTripVersion]);

  useEffect(() => {
    fetchTripData();
  }, [tripId, fetchTripData]);

  useEffect(() => {
    if (socket && isConnected && accommodations.length === 0) {
      fetchTripData();
    }
  }, [socket, isConnected, accommodations.length, fetchTripData]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleExpenseAdded = (data) => {
      const expenseType = data.expenseType;
      const isPersonal = expenseType === 'PERSONAL';
      const isBudget = data.expenseCategory === 'BUDGET';

      if (isPersonal && !isBudget) {
        return;
      }

      const normalizedExpenseDate =
        !data.expenseDate || data.expenseDate === ''
          ? '1970-01-01'
          : data.expenseDate;

      const newExpense = {
        tripDocumentExpenseId: data.tripDocumentExpenseId,
        payUserId: data.payUserId !== undefined ? data.payUserId : null,
        expenseCategory: data.expenseCategory,
        description: data.description,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        expenseDate: normalizedExpenseDate,
        expenseType: expenseType,
        participants: Array.isArray(data.participants) ? data.participants : [],
      };

      setExpenses((prev) => {
        const exists = prev.some(
          (exp) => exp.tripDocumentExpenseId === data.tripDocumentExpenseId,
        );
        if (exists) {
          return prev;
        }
        return [...prev, newExpense];
      });

      if (isBudget && expenseType === 'SHARED') {
        setStatistics((prev) => {
          const newTotalBudget =
            (prev.shared?.totalBudget || 0) + data.totalAmount;
          const newRemainingBudget =
            newTotalBudget - (prev.shared?.totalSpent || 0);
          return {
            ...prev,
            shared: {
              ...prev.shared,
              totalBudget: newTotalBudget,
              remainingBudget: newRemainingBudget,
            },
          };
        });
      }

      setTimeout(
        () => {
          const targetId = activeVersionIdRef.current;
          if (targetId) {
            refetchCurrentVersion(targetId);
          } else {
            refetchCurrentVersion();
          }
        },
        isBudget ? 800 : 300,
      );
    };

    const handleExpenseUpdated = (data) => {
      const expenseType = data.expenseFields?.expenseType || 'SHARED';
      const isPersonal = expenseType === 'PERSONAL';
      const isBudget = data.expenseFields?.expenseCategory === 'BUDGET';

      if (isPersonal && !isBudget) {
        return;
      }

      const expenseFields = data.expenseFields || {};

      const updatedFields = {};
      if (expenseFields.expenseCategory !== undefined)
        updatedFields.expenseCategory = expenseFields.expenseCategory;
      if (expenseFields.totalAmount !== undefined)
        updatedFields.totalAmount = expenseFields.totalAmount;
      if (expenseFields.description !== undefined)
        updatedFields.description = expenseFields.description;
      if (expenseFields.paymentMethod !== undefined)
        updatedFields.paymentMethod = expenseFields.paymentMethod;
      if (expenseFields.expenseDate !== undefined) {
        updatedFields.expenseDate =
          !expenseFields.expenseDate || expenseFields.expenseDate === ''
            ? '1970-01-01'
            : expenseFields.expenseDate;
      }
      if (expenseFields.expenseType !== undefined)
        updatedFields.expenseType = expenseFields.expenseType;
      if (expenseFields.payUserId !== undefined)
        updatedFields.payUserId = expenseFields.payUserId;
      if (expenseFields.participants !== undefined)
        updatedFields.participants = expenseFields.participants;

      setExpenses((prev) => {
        const existingExpense = prev.find(
          (exp) => exp.tripDocumentExpenseId === data.tripDocumentExpenseId,
        );

        if (!existingExpense) {
          return prev;
        }

        const updatedExpense = {
          ...existingExpense,
          ...updatedFields,
        };

        if (isBudget && expenseType === 'SHARED') {
          const oldAmount = existingExpense.totalAmount || 0;
          const newAmount = updatedExpense.totalAmount || oldAmount;
          const diff = newAmount - oldAmount;

          if (diff !== 0) {
            setStatistics((statPrev) => {
              const newTotalBudget = (statPrev.shared?.totalBudget || 0) + diff;
              const newRemainingBudget =
                newTotalBudget - (statPrev.shared?.totalSpent || 0);
              return {
                ...statPrev,
                shared: {
                  ...statPrev.shared,
                  totalBudget: newTotalBudget,
                  remainingBudget: newRemainingBudget,
                },
              };
            });
          }
        }

        const updated = prev.map((expense) =>
          expense.tripDocumentExpenseId === data.tripDocumentExpenseId
            ? updatedExpense
            : expense,
        );
        return updated;
      });

      setTimeout(
        () => {
          const targetId = activeVersionIdRef.current;
          if (targetId) {
            refetchCurrentVersion(targetId);
          } else {
            refetchCurrentVersion();
          }
        },
        isBudget ? 800 : 300,
      );
    };

    const handleExpenseDeleted = (data) => {
      setExpenses((prev) =>
        prev.filter(
          (expense) =>
            expense.tripDocumentExpenseId !== data.tripDocumentExpenseId,
        ),
      );

      setTimeout(() => {
        const targetId = activeVersionIdRef.current;
        if (targetId) {
          refetchCurrentVersion(targetId);
        } else {
          refetchCurrentVersion();
        }
      }, 300);
    };

    const handleTaskAdded = (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    };

    const handleTaskUpdated = ({ tripDocumentTaskId, taskFields }) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.tripDocumentTaskId === tripDocumentTaskId
            ? { ...task, ...taskFields }
            : task,
        ),
      );
    };

    const handleTaskDeleted = ({ tripDocumentTaskId }) => {
      setTasks((prev) =>
        prev.filter((task) => task.tripDocumentTaskId !== tripDocumentTaskId),
      );
    };

    const handleParticipantCountUpdated = ({ participantFields }) => {
      setParticipantCount(participantFields.count);
    };

    const handleAccommodationAdded = (newAccommodation) => {
      if (!newAccommodation) return;

      setAccommodations((prev) => {
        const exists = prev.some(
          (acc) =>
            acc.tripDocumentAccommodationId ===
            newAccommodation.tripDocumentAccommodationId,
        );
        if (exists) {
          return prev;
        }
        return [...prev, newAccommodation];
      });
    };

    const handleAccommodationUpdated = ({
      tripDocumentAccommodationId,
      accommodationFields,
    }) => {
      if (!tripDocumentAccommodationId || !accommodationFields) return;

      setAccommodations((prev) => {
        const existingIndex = prev.findIndex(
          (accommodation) =>
            accommodation.tripDocumentAccommodationId ===
            tripDocumentAccommodationId,
        );

        if (existingIndex === -1) {
          return prev;
        }

        const existing = prev[existingIndex];
        const hasChanges = Object.keys(accommodationFields).some(
          (key) => existing[key] !== accommodationFields[key],
        );

        if (!hasChanges) {
          return prev;
        }

        return prev.map((accommodation) =>
          accommodation.tripDocumentAccommodationId ===
          tripDocumentAccommodationId
            ? { ...accommodation, ...accommodationFields }
            : accommodation,
        );
      });
    };

    const handleAccommodationDeleted = ({ tripDocumentAccommodationId }) => {
      if (!tripDocumentAccommodationId) return;

      setAccommodations((prev) =>
        prev.filter(
          (accommodation) =>
            accommodation.tripDocumentAccommodationId !==
            tripDocumentAccommodationId,
        ),
      );
    };

    socket.on('expenseAdded', handleExpenseAdded);
    socket.on('expenseUpdated', handleExpenseUpdated);
    socket.on('expenseDeleted', handleExpenseDeleted);

    socket.on('taskAdded', handleTaskAdded);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);

    socket.on('participantCountUpdated', handleParticipantCountUpdated);

    socket.on('accommodationAdded', handleAccommodationAdded);
    socket.on('accommodationUpdated', handleAccommodationUpdated);
    socket.on('accommodationDeleted', handleAccommodationDeleted);

    const handleError = ({ message }) => {
      alert(`지출 작업 중 오류가 발생했습니다: ${message}`);
      setError(new Error(message));
    };
    socket.on('error', handleError);

    const handleVersionChanged = async ({ tripDocumentVersionId, isNew }) => {
      if (tripDocumentVersionId === selectedVersionIdRef.current) return;
      if (isNew) {
        await fetchTripData();
      }
      await fetchTripVersion(tripDocumentVersionId, { emitSocket: false });
    };
    socket.on('versionChanged', handleVersionChanged);

    return () => {
      socket.off('expenseAdded', handleExpenseAdded);
      socket.off('expenseUpdated', handleExpenseUpdated);
      socket.off('expenseDeleted', handleExpenseDeleted);

      socket.off('taskAdded', handleTaskAdded);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);

      socket.off('participantCountUpdated', handleParticipantCountUpdated);

      socket.off('accommodationAdded', handleAccommodationAdded);
      socket.off('accommodationUpdated', handleAccommodationUpdated);
      socket.off('accommodationDeleted', handleAccommodationDeleted);

      socket.off('error', handleError);
      socket.off('versionChanged', handleVersionChanged);
    };
  }, [socket, refetchCurrentVersion, fetchTripData, fetchTripVersion]);

  return {
    expenses,
    statistics,
    settlement,
    accommodations,
    tasks,
    participantCount,
    document,
    versions,
    activeVersionId,
    selectedVersionId,
    loading,
    error,
    socket,
    isConnected,
    isConnecting,
    socketError,
    setExpenses,
    setStatistics,
    setAccommodations,
    setTasks,
    setParticipantCount,
    fetchTripVersion,
    renameTripVersion,
    createInterimSettlementVersion,
    refetch: refetchCurrentVersion,
  };
};

export default useTripDetails;
