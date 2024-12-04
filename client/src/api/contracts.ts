import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadProjectDocuments = async (
  projectId: number,
  contractUrl: string,
  paymentUrl: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/projects/${projectId}/upload-documents`,
      {
        contract_url: contractUrl,
        payment_url: paymentUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error al subir los documentos');
    }
    throw error;
  }
};

export const getProjectDocuments = async (projectId: number, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error al obtener los documentos');
    }
    throw error;
  }
};