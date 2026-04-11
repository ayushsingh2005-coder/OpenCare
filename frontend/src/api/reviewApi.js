import API from './axios';

export const addReview = (data) => API.post('/reviews', data);
// data: { serviceId, rating, comment }

export const getServiceReviews = (serviceId) =>
    API.get(`/reviews/service/${serviceId}`);

export const deleteReview = (id) => API.delete(`/reviews/${id}`);