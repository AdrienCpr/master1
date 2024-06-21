import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Post, Machine } from '@/types';
import { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface Operation {
    id: number,
    name: string,
    time: string,
    post_id: number,
    machine_id: number,
    ranges: Range[]
}

interface OperationsProps extends PageProps {
    operations: Operation[];
    posts: Post[];
    machines: Machine[];
}

export default function Operations({ auth, operations, posts, machines }: OperationsProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);

    const { data, setData, post, put, delete: destroy, errors } = useForm({
        name: '',
        time: '',
        post_id: '',
        machine_id: ''
    });

    const openCreateModal = () => {
        setData({ name: '', time: '', post_id: '', machine_id: '' });
        setCreateModalOpen(true);
    };

    const openEditModal = (operation: Operation) => {
        setData({ name: operation.name, time: operation.time, post_id: operation.post_id.toString(), machine_id: operation.machine_id.toString() });
        setCurrentOperation(operation);
        setEditModalOpen(true);
    };

    const openDeleteModal = (operation: Operation) => {
        setCurrentOperation(operation);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const handleCreate = () => {
        post(route('operations.store'), {
            onSuccess: () => {
                closeModals();
                toast.success('Opération créée avec succès !');
            },
        });
    };

    const handleUpdate = () => {
        if (currentOperation) {
            put(route('operations.update', currentOperation.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Opération mise à jour avec succès !');
                },
            });
        }
    };

    const handleDelete = () => {
        if (currentOperation) {
            destroy(route('operations.destroy', currentOperation.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Opération supprimée avec succès !');
                },
            });
        }
    };

    const filteredOperations = operations.filter(operation =>
        operation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOperations = filteredOperations.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const filteredMachinesByPost = (post_id: string) => {
        return machines.filter(machine => machine.post_id.toString() === post_id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Opérations</h2>}
        >
            <Head title="Opérations" />

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
                            Ajouter une opération
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Nom</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Temps</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Poste</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Machine</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentOperations.map(operation => (
                                <tr key={operation.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{operation.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{operation.time}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{posts.find(post => post.id === operation.post_id)?.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{machines.find(machine => machine.id === operation.machine_id)?.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                                        <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => openEditModal(operation)}><FaEdit /></button>
                                        {operation.ranges.length === 0 && (
                                            <button className="text-red-500 hover:text-red-700" onClick={() => openDeleteModal(operation)}><FaTrash /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredOperations.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Création d'opération */}
            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer une opération</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Temps</label>
                            <input type="time" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value.toString() })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.time && <div className="text-red-500 mt-1">{errors.time}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Poste</label>
                            <select
                                value={data.post_id}
                                onChange={(e) => {
                                    const postId = e.target.value;
                                    setData({
                                        ...data,
                                        post_id: postId,
                                        machine_id: '', // Reset machine_id when post_id changes
                                    });
                                }}
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="" disabled>Sélectionner un poste</option>
                                {posts.map(post => (
                                    <option key={post.id} value={post.id}>{post.name}</option>
                                ))}
                            </select>
                            {errors.post_id && <div className="text-red-500 mt-1">{errors.post_id}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Machine</label>
                            <select
                                value={data.machine_id}
                                onChange={(e) => setData({ ...data, machine_id: e.target.value })}
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="" disabled>Sélectionner une machine</option>
                                {filteredMachinesByPost(data.post_id).map(machine => (
                                    <option key={machine.id} value={machine.id}>{machine.name}</option>
                                ))}
                            </select>
                            {errors.machine_id && <div className="text-red-500 mt-1">{errors.machine_id}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Créer</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Édition d'opération */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Éditer une opération</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Temps</label>
                            <input type="time" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value.toString() })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.time && <div className="text-red-500 mt-1">{errors.time}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Poste</label>
                            <select
                                value={data.post_id}
                                onChange={(e) => {
                                    const postId = e.target.value;
                                    setData({
                                        ...data,
                                        post_id: postId,
                                        machine_id: '', // Reset machine_id when post_id changes
                                    });
                                }}
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="" disabled>Sélectionner un poste</option>
                                {posts.map(post => (
                                    <option key={post.id} value={post.id}>{post.name}</option>
                                ))}
                            </select>
                            {errors.post_id && <div className="text-red-500 mt-1">{errors.post_id}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Machine</label>
                            <select
                                value={data.machine_id}
                                onChange={(e) => setData({ ...data, machine_id: e.target.value })}
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="" disabled>Sélectionner une machine</option>
                                {filteredMachinesByPost(data.post_id).map(machine => (
                                    <option key={machine.id} value={machine.id}>{machine.name}</option>
                                ))}
                            </select>
                            {errors.machine_id && <div className="text-red-500 mt-1">{errors.machine_id}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Mettre à jour</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Suppression d'opération */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Supprimer l'opération</h2>
                    <p>Êtes-vous sûr de vouloir supprimer cette opération ? Cette action est irréversible.</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                        <button onClick={handleDelete} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                    </div>
                </div>
            </Modal>

            <ToastContainer />
        </AuthenticatedLayout>
    );
}
