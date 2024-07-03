import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Machine, PageProps, Piece, Post, User } from '@/types';
import React, { useState } from "react";
import { PencilIcon, SearchIcon, TrashIcon } from "lucide-react";
import Modal from "react-modal";
import { Inertia } from "@inertiajs/inertia";
import {toast, ToastContainer} from "react-toastify";

type Operation = {
    id: number;
    name: string;
    time: string;
    post: Post;
    machine: Machine;
};

type RangeProduce = {
    
}

type Range = {
    id: number;
    name: string;
    user: User;
    piece: Piece;
    operations: Operation[];
    range_produces: RangeProduce[]
};

interface RangeProps extends PageProps {
    ranges: Range[];
    posts: Post[];
    machines: Machine[];
    pieces: Piece[];
    users: User[];
    operations: Operation[];
}

export default function Ranges({ auth, ranges, posts, machines, pieces, users, operations }: RangeProps) {
    console.log(ranges)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRange, setSelectedRange] = useState<Range | null>(null);
    const [isProduceModalOpen, setIsProduceModalOpen] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 3;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredRanges = ranges.filter((range) =>
        range.piece.name.includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRanges.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRanges.length / itemsPerPage);

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentRange, setCurrentRange] = useState<Range | null>(null);

    const { data, setData, post, put, delete: destroy } = useForm({
        piece_id: '',
        user_id: '',
        range_operations: [{ operation_id: '' }]
    });

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const addRange = () => {
        setData({ piece_id: '', user_id: '', range_operations: [{ operation_id: '' }] });
        setCreateModalOpen(true);
    };

    const handleCreate = () => {
        post(route('ranges.store'), {
            onSuccess: () => {
                closeModals();
                toast.success('Gamme créé avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la suppression de la gamme.');
            }
        });
    };

    const editRange = (id: number) => {
        const range = ranges.find(range => range.id === id);
        console.log(range)
        if (range) {
            setData({
                piece_id: range.piece.id.toString(),
                user_id: range.user.id.toString(),
                range_operations: range.operations.map(operation => ({
                    operation_id: operation.id.toString(),
                }))
            });
            setCurrentRange(range);
            setEditModalOpen(true);
        }
    };

    const openDeleteModal = (range: Range) => {
        setCurrentRange(range);
        setDeleteModalOpen(true);
    };

    const openModal = (range: Range) => {
        setSelectedRange(range);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRange(null);
    };

    const openProduceModal = (range: Range) => {
        setSelectedRange(range);
        setIsProduceModalOpen(true);
    };

    const closeProduceModal = () => {
        setIsProduceModalOpen(false);
        setSelectedRange(null);
    };

    const handleOperationChange = (index: number, field: string, value: string) => {
        if (selectedRange) {
            const updatedOperations = selectedRange.operations.map((op, idx) => {
                if (idx === index) {
                    return {
                        ...op,
                        [field]: field === 'post' ? posts.find(post => post.id === parseInt(value, 10)) || op[field] : value,
                    };
                }
                return op;
            });
            setSelectedRange({
                ...selectedRange,
                operations: updatedOperations,
            });
        }
    };

    const handleCreateProduce = () => {
        if (selectedRange) {
            const formData = new FormData();
            formData.append(`range_id`, selectedRange.id.toString());
            selectedRange.operations.forEach((operation, index) => {
                formData.append(`operations[${index}][id]`, operation.id.toString());
                formData.append(`operations[${index}][time]`, operation.time);
                formData.append(`operations[${index}][post_id]`, operation.post.id.toString());
                formData.append(`operations[${index}][machine_id]`, operation.machine.toString());
            });

            Inertia.post('/atelier/ranges/produce', formData, {
                onSuccess: () => {
                    toast.success('Gamme produite avec succès!');
                    closeProduceModal();
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la production de la gamme.');
                }
            });
        }
    };

    const handleUpdate = () => {
        put(route('ranges.update', { range: currentRange?.id }), {
            onSuccess: () => {
                closeModals();
                toast.success('Gamme modifié avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la modification de la gamme.');
            }
        });
    };

    const handleDelete = () => {
        if (currentRange) {
            destroy(route('ranges.destroy', currentRange.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Gamme supprimé avec succès!');
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la suppression de la gamme.');
                }
            });
        }
    };

    const filteredMachinesByPost = (post_id: number) => {
        return machines.filter(machine => machine.post_id === post_id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gammes</h2>}
        >
            <ToastContainer />
            <Head title="Gammes" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="relative w-full max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Rechercher une gamme"
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {auth.user.role.name === "responsable" && (
                            <button
                                onClick={addRange}
                                className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white"
                            >
                                Ajouter une gamme
                            </button>
                        )}
                    </div>
                    <div className="grid gap-8">
                        {currentItems.map((range) => (
                            <div key={range.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {auth.user.id === range.user.id && (
                                            <div>
                                                <button
                                                    onClick={() => editRange(range.id)}
                                                    className="text-gray-500 hover:text-black focus:outline-none"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                {range.range_produces.length === 0 && (
                                                    <button
                                                        onClick={() => openDeleteModal(range)}
                                                        className="text-gray-500 hover:text-black focus:outline-none"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <h2 className="text-xl font-semibold">{range.piece.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Responsable : {range.user.name}</span>
                                        <button
                                            onClick={() => openProduceModal(range)}
                                            className="px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                                        >
                                            Produire
                                        </button>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {range.operations.map((operation) => (
                                        <li key={operation.id}>
                                            {operation.name}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => openModal(range)}
                                    className="mt-4 px-3 py-1 border border-black text-black rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                >
                                    Détails des opérations
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6 space-x-1">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal pour afficher les détails d'une gamme */}
            {selectedRange && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Opération"
                    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
                >
                    <div className="bg-white rounded-lg p-8 max-w-3xl overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Opérations</h2>
                        <ul className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {selectedRange.operations.map((operation) => (
                                    <li key={operation.id} className="bg-gray-100 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold">{operation.name}</h3>
                                        <p>Poste: {operation.post.name}</p>
                                        <p>Machine: {operation.machine.name}</p>
                                        <p>Temps: {operation.time}</p>
                                    </li>
                                ))}
                            </div>
                        </ul>
                        <button
                            onClick={closeModal}
                            className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                        >
                            Fermer
                        </button>
                    </div>
                </Modal>
            )}

            {/* Modal pour la production */}
            {selectedRange && (
                <Modal
                    isOpen={isProduceModalOpen}
                    onRequestClose={closeProduceModal}
                    contentLabel="Produire"
                    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
                >
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-8 max-w-3xl overflow-y-auto">
                            <h2 className="text-2xl font-semibold mb-4">Produire</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleCreateProduce(); }}>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {selectedRange.operations.map((operation, index) => (
                                        <div key={operation.id} className="bg-gray-100 rounded-lg p-2 w-auto">
                                            <h3 className="text-lg font-semibold">{operation.name}</h3>
                                            <div className="mt-4">
                                                <label htmlFor={`time-${index}`} className="block text-sm font-medium text-gray-700">
                                                    Temps
                                                </label>
                                                <input
                                                    id={`time-${index}`}
                                                    type="text"
                                                    value={operation.time}
                                                    required
                                                    onChange={(e) => handleOperationChange(index, 'time', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor={`post-${index}`} className="block text-sm font-medium text-gray-700">
                                                    Poste
                                                </label>
                                                <select
                                                    id={`post-${index}`}
                                                    value={operation.post.id}
                                                    required
                                                    onChange={(e) => handleOperationChange(index, 'post', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                >
                                                    <option value="">Sélectionner un poste</option>
                                                    {posts.map((post) => (
                                                        <option key={post.id} value={post.id}>
                                                            {post.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor={`machine-${index}`} className="block text-sm font-medium text-gray-700">
                                                    Machine
                                                </label>
                                                <select
                                                    id={`machine-${index}`}
                                                    value={operation.machine.id}
                                                    required
                                                    onChange={(e) => handleOperationChange(index, 'machine', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                >
                                                    <option value="">Sélectionner une machine</option>
                                                    {filteredMachinesByPost(operation.post.id).map((machine) => (
                                                        <option key={machine.id} value={machine.id}>
                                                            {machine.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                                >
                                    Créer
                                </button>
                                <button
                                    type="button"
                                    onClick={closeProduceModal}
                                    className="mt-6 ml-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                                >
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal pour la création */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={closeModals}
                contentLabel="Créer une gamme"
                className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
            >
                <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                    <h2 className="text-2xl font-semibold mb-4">Créer une gamme</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="piece_id" className="block text-sm font-medium text-gray-700">
                                Pièce
                            </label>
                            <select
                                id="piece_id"
                                value={data.piece_id}
                                onChange={(e) => setData('piece_id', e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="">Sélectionner une pièce</option>
                                {pieces.map((piece) => (
                                    <option key={piece.id} value={piece.id}>
                                        {piece.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                Responsable
                            </label>
                            <select
                                id="user_id"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="">Sélectionner un responsable</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Opérations
                            </label>
                            {data.range_operations.map((rangeOperation, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <select
                                        value={rangeOperation.operation_id}
                                        required
                                        onChange={(e) => {
                                            const updatedRangeOperations = data.range_operations.map((op, idx) =>
                                                idx === index ? { ...op, operation_id: e.target.value } : op
                                            );
                                            setData('range_operations', updatedRangeOperations);
                                        }}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        <option value="">Sélectionner une opération</option>
                                        {operations.map((operation) => (
                                            <option key={operation.id} value={operation.id}>
                                                {operation.name}
                                            </option>
                                        ))}
                                    </select>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedRangeOperations = data.range_operations.filter((_, idx) => idx !== index);
                                                setData('range_operations', updatedRangeOperations);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setData('range_operations', [...data.range_operations, { operation_id: '' }])}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                            >
                                Ajouter une opération
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                    >
                        Créer
                    </button>
                    <button
                        onClick={closeModals}
                        className="mt-6 ml-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                        Annuler
                    </button>
                </div>
            </Modal>

            {/* Modal pour la modification */}
            {currentRange && (
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeModals}
                    contentLabel="Modifier une gamme"
                    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                        <h2 className="text-2xl font-semibold mb-4">Modifier une gamme</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="piece_id" className="block text-sm font-medium text-gray-700">
                                    Pièce
                                </label>
                                <select
                                    id="piece_id"
                                    value={data.piece_id}
                                    required
                                    onChange={(e) => setData('piece_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    <option value="">Sélectionner une pièce</option>
                                    {pieces.map((piece) => (
                                        <option key={piece.id} value={piece.id}>
                                            {piece.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                    Responsable
                                </label>
                                <select
                                    id="user_id"
                                    value={data.user_id}
                                    required
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    <option value="">Sélectionner un responsable</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Opérations
                                </label>
                                {data.range_operations.map((rangeOperation, index) => (
                                    <div key={index} className="flex items-center space-x-2 mt-2">
                                        <select
                                            value={rangeOperation.operation_id}
                                            required
                                            onChange={(e) => {
                                                const updatedRangeOperations = data.range_operations.map((op, idx) =>
                                                    idx === index ? { ...op, operation_id: e.target.value } : op
                                                );
                                                setData('range_operations', updatedRangeOperations);
                                            }}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                        >
                                            <option value="">Sélectionner une opération</option>
                                            {operations.map((operation) => (
                                                <option key={operation.id} value={operation.id}>
                                                    {operation.name}
                                                </option>
                                            ))}
                                        </select>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedRangeOperations = data.range_operations.filter((_, idx) => idx !== index);
                                                    setData('range_operations', updatedRangeOperations);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setData('range_operations', [...data.range_operations, { operation_id: '' }])}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                >
                                    Ajouter une opération
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleUpdate}
                            className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={closeModals}
                            className="mt-6 ml-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                        >
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}

            {/* Modal pour la suppression */}
            {currentRange && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={closeModals}
                    contentLabel="Supprimer une gamme"
                    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                        <h2 className="text-2xl font-semibold mb-4">Supprimer une gamme</h2>
                        <p>Êtes-vous sûr de vouloir supprimer cette gamme ? Cette action est irréversible.</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
                            >
                                Supprimer
                            </button>
                            <button
                                onClick={closeModals}
                                className="ml-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
