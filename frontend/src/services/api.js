import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

// Brand
export const saveBrand = (data) => API.post('/brand', data);
export const getBrand = (id) => API.get(`/brand/${id}`);
export const getAllBrands = () => API.get('/brands');
export const validateBrand = (data) => API.post('/brand/validate', data);
export const updateBrand = (id, data) => API.put(`/brand/${id}`, data);

// Content Generation
export const generateContent = (data) => API.post('/generate-content', data);
export const regeneratePiece = (data) => API.post('/regenerate-piece', data);
export const saveContentPiece = (data) => API.post('/content-pieces', data);
export const getContentPieces = () => API.get('/content-pieces');

// Repurpose
export const repurposeContent = (data) => API.post('/repurpose', data);

// Ads
export const generateAds = (data) => API.post('/generate-ads', data);
export const getAds = () => API.get('/ads');
export const updateAdStatus = (id, status) => API.patch(`/ads/${id}/status`, { status });
export const exportAds = () => API.get('/ads/export');

// Sentiment
export const analyseSentimentCSV = (formData) =>
  API.post('/analyse-sentiment', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const analyseSentimentText = (text) =>
  API.post('/analyse-sentiment-text', { text });

// Calendar
export const getCalendar = () => API.get('/calendar');
export const updateCalendarItem = (id, data) => API.patch(`/calendar/${id}`, data);
export const deleteCalendarItem = (id) => API.delete(`/calendar/${id}`);
export const suggestSchedule = (data) => API.post('/calendar/suggest-schedule', data);
