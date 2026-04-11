import API from './axios';

export const getProviderDashboard = () => API.get('/providers/dashboard');
export const getMyServices = () => API.get('/providers/my-services');
export const getEarningsBreakdown = () => API.get('/providers/earnings');