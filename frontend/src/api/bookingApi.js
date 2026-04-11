import API from './axios';

export const createBooking = (data) => API.post('/bookings', data);
// data: { serviceId, date, note }

export const getMyBookings = () => API.get('/bookings/my-bookings');

export const getProviderBookings = (status) =>
    API.get('/bookings/provider', {
        params: status ? { status } : {},
    });

export const updateBookingStatus = (id, status) =>
    API.put(`/bookings/${id}/status`, { status });