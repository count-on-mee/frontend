import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

function useTripItinerary(tripId) {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItinerary = useCallback(async () => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get(`/trips/${tripId}`, {
        params: { 'include[]': 'itineraries' },
      });

      const validItineraries = (data.itineraries || []).filter(
        (item) => item.tripItineraryId || item.itineraryId || item.id,
      );

      setItinerary(validItineraries);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  const moveItineraries = async (moves) => {
    const payload = Array.isArray(moves) ? { moves } : moves;
    const { data } = await axiosInstance.patch(
      `/trips/${tripId}/itineraries`,
      payload,
    );
    return data;
  };

  const deleteItinerary = async (itineraryId) => {
    await axiosInstance.delete(`/trips/${tripId}/itineraries/${itineraryId}`);
  };

  const addItinerary = async ({ spotId, day, order }) => {
    const { data } = await axiosInstance.post(`/trips/${tripId}/itineraries`, {
      spotId,
      day,
      order,
    });
    return data;
  };

  const updateTripDates = async ({ startDate, endDate }) => {
    try {
      await axiosInstance.patch(`/trips/${tripId}`, {
        startDate,
        endDate,
      });

      const { data } = await axiosInstance.get(`/trips/${tripId}`, {
        params: { 'include[]': 'itineraries' },
      });

      const validItineraries = (data.itineraries || []).filter(
        (item) => item.tripItineraryId || item.itineraryId || item.id,
      );
      setItinerary(validItineraries);

      return data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  return {
    itinerary,
    loading,
    error,
    moveItineraries,
    deleteItinerary,
    addItinerary,
    updateTripDates,
    refetch: fetchItinerary,
  };
}

export default useTripItinerary;
