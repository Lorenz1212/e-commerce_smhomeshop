import api from '@@@@/api'

export interface Model {
  id: number
  name: string
}

export async function fetchData(): Promise<Model[]> {
  try {
    const response = await api.get('/category');
    const result = response.data;

    // Your backend directly returns an array
    if (Array.isArray(result)) {
      return result;
    }

    console.warn('Unexpected response shape:', result);
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}