// UserContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';

const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            console.log(response.data);
            setUsers(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    
    }, []);

    return (
        <UserContext.Provider value={{ users, setUsers, loading ,fetchUsers,deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};
export const useUserContext = () => useContext(UserContext);
