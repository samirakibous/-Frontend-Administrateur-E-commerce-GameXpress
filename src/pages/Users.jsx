// UserManagementTable.js
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Password } from '@mui/icons-material';

export default function UserManagementTable() {
    const { users, setUsers, loading, fetchUsers, deleteUser, getRoles, roles } = useUserContext();
    const [editingUser, setEditingUser] = useState(null);
    // const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({
        name: '',
        prenom: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: ''
    });
    useEffect(() => {
        fetchUsers();
        // fetchRoles();
        const fetchRoles = async () => {
            try {
                const response = getRoles();
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles', error);
            }
        }
        fetchRoles();
        getRoles();
        // console.log(roles);
    }, []);
    // useEffect(() => {
    //     // console.log(roles);
    //     console.log("roles test : ",roles);

    // }, [roles]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const handleEdit = (user) => {
        setEditingUser({ ...user });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await api.put(`admin/users/${editingUser.id}`, editingUser);
            console.log(response.data);
            // Mettre à jour l'utilisateur dans l'état local
            setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
            setEditingUser(null);
            fetchUsers();
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            setUsers(users.filter(user => user.id !== id));
            deleteUser(id);
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await api.post('admin/users', newUser); // Remplacez avec l'URL de votre API
            setUsers([...users, response.data]);
            setNewUser({
                nom: '',
                email: '',
                role: '',
                password: '',
                password_confirmation: ''
            });
            setShowAddForm(false);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        }
    };

    const handleChangeEditingUser = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    };

    const handleChangeNewUser = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                    </div>
                )}
                <div className="p-6 bg-gray-50 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Utilisateurs</h2>

                    {/* Barre d'outils */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                            onClick={() => setShowAddForm(true)}
                        >
                            <PersonAddIcon className="h-5 w-5" />
                            Ajouter un utilisateur
                        </button>
                    </div>

                    {/* Formulaire d'ajout */}
                    {showAddForm && (
                        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                            <h3 className="text-lg font-medium mb-4">Ajouter un nouvel utilisateur</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={newUser.name}
                                        onChange={handleChangeNewUser}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={newUser.email}
                                        onChange={handleChangeNewUser}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>

                                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label> */}

                                    <select className="w-full p-1 border border-gray-300 rounded">
                                        {roles && roles.map((role) => (
                                            <option key={role.id} value={role.name}>{role.name}</option>

                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={newUser.password}
                                        onChange={handleChangeNewUser}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Confirmation</label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={newUser.password_confirmation}
                                        onChange={handleChangeNewUser}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                                    onClick={handleAddUser}
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tableau des utilisateurs */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-gray-700 font-medium">ID</th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Nom</th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Email</th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Rôle</th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            {editingUser && editingUser.id === user.id ? (
                                                <>
                                                    <td className="py-3 px-4 text-gray-500">{user.id}</td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                            value={editingUser.name}
                                                            onChange={handleChangeEditingUser}
                                                        />
                                                    </td>

                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                            value={editingUser.email}
                                                            onChange={handleChangeEditingUser}
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">

                                                        <select className="w-full p-1 border border-gray-300 rounded"
                                                            name="role"
                                                         value={editingUser.role}
                                                         onChange={handleChangeEditingUser}>
                                                            {roles && roles.map((role) => (
                                                                <option key={role.id} value={role.name}>{role.name}</option>

                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="text-green-500 hover:text-green-600"
                                                            >
                                                                <CheckIcon />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="text-red-500 hover:text-red-600"
                                                            >
                                                                <CloseIcon />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="py-3 px-4">{user.id}</td>
                                                    <td className="py-3 px-4">{user.name}</td>
                                                    <td className="py-3 px-4">{user.email}</td>
                                                    <td className="py-3 px-4">
                                                        {user.roles.length > 0 ? user.roles[0].name : 'Aucun rôle'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(user)}
                                                                className="text-blue-500 hover:text-blue-600"
                                                            >
                                                                <EditIcon />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="text-red-500 hover:text-red-600"
                                                            >
                                                                <DeleteIcon />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </Box>
        </Box>
    );
}