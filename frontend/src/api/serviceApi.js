import API from './axios';

// Get all services with optional filters
export const getAllServices = (params) => API.get('/services', { params });

// params example:
// { category: 'plumbing', location: 'Lucknow', minPrice: 100, maxPrice: 1000,
//   keyword: 'fix', page: 1, limit: 10, sortBy: 'price', order: 'asc' }

export const getServiceById = (id) => API.get(`/services/${id}`);
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);