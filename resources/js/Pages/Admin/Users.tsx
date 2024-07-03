import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, {useEffect, useState} from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PageProps, Post, Role, User } from "@/types";

interface UsersProps extends PageProps {
    users: User[];
    posts: Post[];
    roles: Role[];
}

export default function Users({ auth, users, posts, roles }: UsersProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    console.log(users)
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]); // State pour les posts sélectionnés

    const { data, setData, put, post, delete: destroy, errors } = useForm({
        name: '',
        email: '',
        role_id: '',
        password: '',
        posts: [] as number[]
    });

    const openCreateModal = () => {
        setData({ name: '', email: '', role_id: '', password:'', posts: [] });
        setCreateModalOpen(true);
    };

    const openEditModal = (user: User) => {
        const selectedPostsIds = user.posts.map(post => post.id);
        setData({
            name: user.name,
            email: user.email,
            role_id: user.role_id.toString(),
            password: '',
            posts: selectedPostsIds
        });
        setSelectedPosts(selectedPostsIds);
        setCurrentUser(user);
        setEditModalOpen(true);
    };


    const openDeleteModal = (user: User) => {
        setCurrentUser(user);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const handleAdd = () => {
        post(route('users.store'), {
            data: {
                ...data
            },
            onSuccess: () => {
                closeModals();
                toast.success('Utilisateur créée avec succès');
            },
        });
    };

    const handleDelete = () => {
        destroy(route('users.destroy', currentUser?.id), {
            data: {
                ...data
            },
            onSuccess: () => {
                closeModals();
                toast.success('Utilisateur supprimé avec succès');
            },
        });
    };

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            posts: selectedPosts
        }));
    }, [selectedPosts]);

    const handleUpdate = () => {
        if (currentUser) {
            put(route('users.update', currentUser.id), {
                data: {
                    ...data,
                    posts: selectedPosts
                },
                onSuccess: () => {
                    closeModals();
                    toast.success('Utilisateur modifié avec succès');
                },
            });
        }
    };

    const handleAddPostSelect = () => {
        setSelectedPosts([...selectedPosts, 0]);
    };

    const handleRemovePostSelect = (index: number) => {
        const updatedPosts = [...selectedPosts];
        updatedPosts.splice(index, 1);
        setSelectedPosts(updatedPosts);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Utilisateurs</h2>}
        >
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="border border-gray-300 rounded-md px-4 py-2 w-1/3 bg-white"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white" onClick={openCreateModal}>
                            Ajouter un utilisateur
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Nom</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Email</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Rôle</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Postes</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{user.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{user.email}</td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">{user.role.name}</td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                                        <ul>
                                            {user.posts.map(post => (
                                                <li key={post.id}>{post.name}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                                        <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => openEditModal(user)}><FaEdit /></button>
                                        {user.posts.length === 0 && user.ranges.length === 0 && user.role.name !== "admin" && (
                                            <button className="text-red-500 hover:text-red-700" onClick={() => openDeleteModal(user)}><FaTrash /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer un utilisateur</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-600">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.email && <div className="text-red-600">{errors.email}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Rôle</label>
                            <select value={data.role_id} onChange={(e) => setData({ ...data, role_id: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300">
                                <option value="" disabled>Sélectionner un rôle</option>
                                {roles.map(role => (
                                    <option value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role_id && <div className="text-red-600">{errors.role_id}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.password && <div className="text-red-600">{errors.password}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Édition d'utilisateur */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier l'utilisateur</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-600">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.email && <div className="text-red-600">{errors.email}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.password && <div className="text-red-600">{errors.password}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Rôle</label>
                            <select value={data.role_id} onChange={(e) => setData({ ...data, role_id: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300">
                                <option value="" disabled>Sélectionner un rôle</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role_id && <div className="text-red-600">{errors.role_id}</div>}
                        </div>
                        {data.role_id === "1" && (
                            <>
                                {selectedPosts.map((postId, index) => (
                                    <div key={index} className="mb-4 flex items-center">
                                        <label className="block text-sm font-medium text-gray-700">Poste {index + 1}</label>
                                        <select
                                            value={postId}
                                            onChange={(e) => {
                                                const updatedPosts = [...selectedPosts];
                                                updatedPosts[index] = parseInt(e.target.value);
                                                setSelectedPosts(updatedPosts);
                                            }}
                                            className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"
                                        >
                                            <option value={0} disabled>Sélectionner un poste</option>
                                            {posts.map(post => (
                                                <option key={post.id} value={post.id}>{post.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePostSelect(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))}

                                <button type="button" onClick={handleAddPostSelect} className="text-blue-500 hover:text-blue-700 mb-4">Ajouter un poste</button>
                            </>
                        )}
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Mettre à jour</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Suppression d'utilisateur */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Supprimer l'utilisateur</h2>
                    <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {currentUser?.name} ?</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => {
                            closeModals();
                            handleDelete();
                        }}>Supprimer</button>
                    </div>
                </div>
            </Modal>

            <ToastContainer />
        </AuthenticatedLayout>
    );
}
