import axios from 'axios';
import axiosInstance from '../authentication/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER + '/ben-xe';

const BenXeService = {
    getAllBenXe: async () => {
        try {
            const response = await axiosInstance.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getBenXeById: async (id) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createBenXe: async (data) => {
        try {
            console.log('data', data);
            const response = await axiosInstance.post(`${API_URL}`, data);
            return response.data;
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    },

    updateBenXe: async (id, data) => {
        console.log('data', data);
        try {
            const response = await axiosInstance.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteBenXe: async (id, token) => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default BenXeService;
