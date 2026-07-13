import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Accept': 'application/json' },
});

export async function loginUser(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function getReports(params = {}) {
  const response = await api.get('/reports', { params });
  return response.data;
}

export async function createReport(formData) {
  const response = await api.post('/reports', formData);
  return response.data;
}

export async function toggleVote(reportId) {
  const response = await api.post(`/reports/${reportId}/votes`);
  return response.data;
}

export async function getReport(reportId) {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
}

export async function getComments(reportId) {
  const response = await api.get(`/reports/${reportId}/comments`);
  return response.data;
}

export async function postComment(reportId, payload) {
  const response = await api.post(`/reports/${reportId}/comments`, payload);
  return response.data;
}

export async function updateStatus(reportId, payload) {
  const response = await api.put(`/reports/${reportId}/status`, payload);
  return response.data;
}

export async function updateReport(reportId, formData) {
  formData.append('_method', 'PUT');
  const response = await api.post(`/reports/${reportId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function archiveReport(reportId) {
  const response = await api.delete(`/reports/${reportId}`);
  return response.data;
}

export async function getStats() {
  const response = await api.get('/reports/stats');
  return response.data;
}
