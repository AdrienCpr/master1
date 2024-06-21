import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps, Machine, Post } from '@/types';
import { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MachinesProps extends PageProps {
    machines: Machine[];
    posts: Post[];
}

export default function Machines({ auth, machines, posts }: MachinesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentMachine, setCurrentMachine] = useState<Machine | null>(null);

    const { data, setData, post, put, delete: destroy, errors } = useForm({
        name: '',
        post_id: ''
    });

    const openCreateModal = () => {
        setData({ name: '', post_id: '' });
        setCreateModalOpen(true);
    };

    const openEditModal = (machine: Machine) => {
        setData({ name: machine.name, post_id: machine.post_id.toString() });
        setCurrentMachine(machine);
        setEditModalOpen(true);
    };

    const openDeleteModal = (machine: Machine) => {
        setCurrentMachine(machine);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const handleCreate = () => {
        post(route('machines.store'), {
            onSuccess: () => {
                closeModals();
                toast.success('Machine créée avec succès');
            },
        });
    };

    const handleUpdate = () => {
        if (currentMachine) {
            put(route('machines.update', currentMachine.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Machine modifiée avec succès');
                },
            });
        }
    };

    const handleDelete = () => {
        if (currentMachine) {
            destroy(route('machines.destroy', currentMachine.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Machine supprimée avec succès');
                },
            });
        }
    };

    const filteredMachines = machines.filter(machine =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMachines = filteredMachines.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Machines</h2>}
        >
            <Head title="Machines" />

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
                            Ajouter une machine
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Nom</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Poste</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentMachines.map(machine => (
                                <tr key={machine.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{machine.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{posts.find(post => post.id === machine.post_id)?.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                                        <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => openEditModal(machine)}><FaEdit /></button>
                                        <button className="text-red-500 hover:text-red-700" onClick={() => openDeleteModal(machine)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredMachines.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Création de machine */}
            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer une machine</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-600">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Poste</label>
                            <select value={data.post_id} onChange={(e) => setData({ ...data, post_id: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300">
                                <option value="" disabled>Sélectionner un poste</option>
                                {posts.map(post => (
                                    <option key={post.id} value={post.id}>{post.name}</option>
                                ))}
                            </select>
                            {errors.post_id && <div className="text-red-600">{errors.post_id}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Édition de machine */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier la machine</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                            {errors.name && <div className="text-red-600">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Poste</label>
                            <select value={data.post_id} onChange={(e) => setData({ ...data, post_id: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300">
                                <option value="" disabled>Sélectionner un poste</option>
                                {posts.map(post => (
                                    <option key={post.id} value={post.id}>{post.name}</option>
                                ))}
                            </select>
                            {errors.post_id && <div className="text-red-600">{errors.post_id}</div>}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Mettre à jour</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Suppression de machine */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Supprimer la machine</h2>
                    <p>Êtes-vous sûr de vouloir supprimer cette machine ? Cette action est irréversible.</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                        <button onClick={handleDelete} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
