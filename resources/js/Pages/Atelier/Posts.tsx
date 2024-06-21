import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Machine, PageProps } from '@/types';
import { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface Post {
    id: number;
    name: string;
    machines: Machine[]
}
interface PostsProps extends PageProps {
    posts: Post[];
}

export default function Posts({ auth, posts }: PostsProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);

    const { data, setData, post, put, delete: destroy, errors } = useForm({
        name: ''
    });

    const openCreateModal = () => {
        setData({ name: '' });
        setCreateModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setData({ name: post.name });
        setCurrentPost(post);
        setEditModalOpen(true);
    };

    const openDeleteModal = (post: Post) => {
        setCurrentPost(post);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const handleCreate = () => {
        post(route('posts.store'), {
            onSuccess: () => {
                closeModals();
                toast.success('Post créé avec succès');
            },
        });
    };

    const handleUpdate = () => {
        if (currentPost) {
            put(route('posts.update', currentPost.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Post modifié avec succès');
                },
            });
        }
    };

    const handleDelete = () => {
        if (currentPost) {
            destroy(route('posts.destroy', currentPost.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Post supprimé avec succès');
                },
            });
        }
    };

    const filteredPosts = posts.filter(post =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Posts</h2>}
        >
            <Head title="Posts" />

            <ToastContainer />

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
                            Ajouter un post
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Nom</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPosts.map(post => (
                                <tr key={post.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{post.name}</td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                                        <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => openEditModal(post)}><FaEdit /></button>
                                        {post.machines.length === 0 && (
                                            <button className="text-red-500 hover:text-red-700" onClick={() => openDeleteModal(post)}><FaTrash /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredPosts.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Création de post */}
            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer un post</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-600">{errors.name}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Édition de post */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier le post</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-600">{errors.name}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Modifier</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Suppression de post */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Supprimer le post</h2>
                    <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.</p>
                    <div className="flex justify-end">
                        <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                        <button type="button" onClick={handleDelete} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
