// UserContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';

const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState(null);

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const response = await api.get('admin/users');
            console.log(response.data);
            setUsers(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
            setLoading(false);
        }
    };
    //recupérer les roles
    const getRoles = async () => {
        try {
            const response = await api.get('admin/roles');
            // console.log(response.data.roles);
            setRoles(response.data);
            // return response.data.roles;
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles', error);
            setLoading(false);
        }
    }

    const deleteUser = async (userId) => {
        try {
            await api.delete(`admin/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
    };
    const addUser = async (user) => {
        try {
            const response = await api.post('admin/users', user);
             console.log(response.data);
            setUsers((prevUsers) => [...prevUsers, response.data]);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        }
    };
    const updateUser = async (userId, updatedUser) => {
        try {
            const response = await api.put(`admin/users/${userId}`, updatedUser);
            setUsers((prevUsers) => prevUsers.map(user => user.id === userId ? response.data : user));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    
    }, []);

    return (
        <UserContext.Provider value={{ users, setUsers, loading ,fetchUsers,deleteUser,addUser,updateUser,getRoles,roles}}>
            {children}
        </UserContext.Provider>
    );
};
export const useUserContext = () => useContext(UserContext);
