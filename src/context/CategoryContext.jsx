import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';

const CategoryContext = createContext();
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories');
            console.log(response.data);
            setCategories(response.data.categories);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories', error);
            setLoading(false);
        }
    }
    const addCategory = async (category) => {
        try {
            const response = await api.post('/admin/categories', category);
            setCategories((prevCategories) => [...prevCategories, response.data]);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie', error);
        }
    }
    const deleteCategory = async (categoryId) => {
        try {
            await api.delete(`/admin/categories/${categoryId}`);
            setCategories((prevCategories) => prevCategories.filter(category => category.id !== categoryId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie', error);
        }
    }
    const updateCategory = async (categoryId, updatedCategory) => {
        try {
            const response = await api.put(`/admin/categories/${categoryId}`, updatedCategory);
            setCategories((prevCategories) => prevCategories.map(category => category.id === categoryId ? response.data : category));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie', error);
        }
    }
    useEffect(() => {
        fetchCategories();
    
    }, []);
    return (
        <CategoryContext.Provider value={{ categories, setCategories, loading, fetchCategories, deleteCategory,addCategory,updateCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}
export const useCategory = () => useContext(CategoryContext);