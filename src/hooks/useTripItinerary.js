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

  const addItinerary = async ({ spotId, day, order }) => {
    await axiosInstance.post(`/trips/${tripId}/itineraries`, {
      spotId,
      day,
      order,
    });
  };

  const moveItineraries = async (moves) => {
    const payload = Array.isArray(moves) ? { moves } : moves;
    try {
      const { data } = await axiosInstance.patch(
        `/trips/${tripId}/itineraries`,
        payload,
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateItinerary = async (itineraryId, { day, order }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/trips/${tripId}/itineraries/${itineraryId}`,
        { day, order },
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteItinerary = async (itineraryId) => {
    await axiosInstance.delete(`/trips/${tripId}/itineraries/${itineraryId}`);
  };

  const updateTripDates = async ({ startDate, endDate }) => {
    await axiosInstance.patch(`/trips/${tripId}`, {
      startDate,
      endDate,
    });
  };

  return {
    itinerary,
    loading,
    error,
    addItinerary,
    moveItineraries,
    updateItinerary,
    deleteItinerary,
    updateTripDates,
    refetch: fetchItinerary,
  };
}

export default useTripItinerary;
