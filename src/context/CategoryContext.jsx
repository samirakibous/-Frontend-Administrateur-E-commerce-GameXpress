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
    const deleteCategory = async (categoryId) => {
        try {
            await api.delete(`/admin/categories/${categoryId}`);
            setCategories((prevCategories) => prevCategories.filter(category => category.id !== categoryId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie', error);
        }
    }
    
    useEffect(() => {
        fetchCategories();
    
    }, []);
    return (
        <CategoryContext.Provider value={{ categories, setCategories, loading, fetchCategories, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}
export const useCategory = () => useContext(CategoryContext);