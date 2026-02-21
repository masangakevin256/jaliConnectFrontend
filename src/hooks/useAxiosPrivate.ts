import axiosInstance from '../api/axios';

export const useAxiosPrivate = () => {
  const token = localStorage.getItem('accessToken');
  
  if (token && !axiosInstance.defaults.headers.common['Authorization']) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return axiosInstance;
};
