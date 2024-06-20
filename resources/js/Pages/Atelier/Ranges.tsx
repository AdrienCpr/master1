import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import { PageProps, Piece, User } from '@/types';
import React, { useState } from "react";
import { PencilIcon, SearchIcon, TrashIcon } from "lucide-react";
import Modal from "react-modal";
import {Inertia} from "@inertiajs/inertia";

type Post = {
    id: number,
    name: string
}

type Machine = {
    id: number,
    name: string
}

type Operation = {
    id: number;
    name: string;
    time: string;
    post: Post;
    machine: Machine;
};

type Range = {
    id: number;
    name: string;
    user: User;
    piece: Piece;
    operations: Operation[];
};

interface RangeProps extends PageProps {
    ranges: Range[],
    posts: Post[],
    machines: Machine[],
    pieces: Piece[],
    users: User[],
    operations: Operation[]
}

export default function Ranges({ auth, ranges, posts, machines, pieces, users, operations }: RangeProps) {
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
        range_operations: [{ operation_id: ''}]
    });

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };
    const addRange = () => {
        setData({ piece_id: '', user_id: '', range_operations: [{ operation_id: ''}] });
        setCreateModalOpen(true);
    };

    const handleCreate = () => {
        post(route('ranges.store'), {
            onSuccess: () => closeModals(),
        });
    };

    const editRange = (id: number) => {
        const range = ranges.find(range => range.id === id);
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

    const handleOperationChange = (index:number, field:string, value:string) => {
        if (selectedRange) {
            const updatedOperations = [...selectedRange.operations];
            updatedOperations[index] = {
                ...updatedOperations[index],
                [field]: value
            };
            setSelectedRange({
                ...selectedRange,
                operations: updatedOperations
            });
        }
    };

    const handleCreateProduce = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedRange) {
            const formData = new FormData();
            formData.append(`range_id`, selectedRange.id.toString());
            selectedRange.operations.forEach((operation, index) => {
                formData.append(`operations[${index}][id]`, operation.id.toString());
                formData.append(`operations[${index}][time]`, operation.time);
                formData.append(`operations[${index}][post_id]`, operation.post.id.toString());
                formData.append(`operations[${index}][machine_id]`, operation.machine.id.toString());
            });

            Inertia.post('/atelier/ranges/produce', formData)

            closeModals()
        }
    };

    const handleUpdate = () => {
        put(route('ranges.update', { range: currentRange?.id }), {
            onSuccess: () => closeModals(),
        });
    };

    const handleDelete = () => {
        if (currentRange) {
            destroy(route('ranges.destroy', currentRange.id), {
                onSuccess: () => closeModals(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gammes</h2>}
        >
            <Head title="Gammes" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex items-center gap-4">
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
                    </div>
                    <div className="grid gap-8">
                        {currentItems.map((range) => (
                            <div key={range.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {auth.user.id === range.user.id &&
                                            (
                                                <div><button
                                                    onClick={() => editRange(range.id)}
                                                    className="text-gray-500 hover:text-black focus:outline-none"
                                                >
                                                    <PencilIcon className="w-5 h-5"/>
                                                </button>
                                                    <button
                                                        onClick={() => openDeleteModal(range)}
                                                        className="text-gray-500 hover:text-black focus:outline-none"
                                                    >
                                                        <TrashIcon className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            )
                                        }
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
                                    {range.operations.map((operation, index) => (
                                        <li key={index}>
                                            {operation.name}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => openModal(range)} className="mt-4 px-3 py-1 border border-black text-black rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                                    Détails des opérations
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`mx-1 px-3 py-1 rounded-md border ${currentPage === i + 1 ? 'bg-gray-300' : 'border-gray-300 hover:bg-gray-200'}`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Modal pour afficher les détails des opérations */}
                    {isModalOpen && selectedRange && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-3xl overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4">{selectedRange.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {selectedRange.operations.map((operation, index) => (
                                        <div key={index} className="bg-gray-100 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold">{operation.name}</h3>
                                            <p className="text-sm">Temps : {operation.time}</p>
                                            <p className="text-sm">Poste : {operation.post.name}</p>
                                            <p className="text-sm">Machine : {operation.machine.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={closeModal} className="mt-4 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nouvelle Modal pour produire */}
                    {isProduceModalOpen && selectedRange && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto">
                                <h2 className="text-2xl font-semibold mb-4">{selectedRange.piece.name} - Produire</h2>
                                <form onSubmit={handleCreateProduce}>
                                    <div className="flex flex-no-wrap gap-4 overflow-x-auto">
                                        {selectedRange.operations.map((operation, index) => (
                                            <div key={index} className="flex-shrink-0 bg-gray-100 rounded-lg p-4 min-w-64">
                                                <h3 className="text-lg font-semibold">{operation.name}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p>Temps :</p>
                                                    <input
                                                        type="time"
                                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                                        value={operation.time}
                                                        onChange={(e) => handleOperationChange(index, 'time', e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p>Poste :</p>
                                                    <select
                                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                                        value={operation.post.id}
                                                        onChange={(e) => handleOperationChange(index, 'post', e.target.value)}
                                                    >
                                                        {posts.map((post) => (
                                                            <option key={post.id} value={post.id}>{post.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p>Machine :</p>
                                                    <select
                                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                                        value={operation.machine.id}
                                                        onChange={(e) => handleOperationChange(index, 'machine', e.target.value)}
                                                    >
                                                        {machines.map((machine) => (
                                                            <option key={machine.id} value={machine.id}>{machine.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end gap-4 mt-4">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                        >
                                            Produire
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeProduceModal}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Création de gamme */}
            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer une gamme</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pièce</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="piece_id"
                                value={data.piece_id}
                                onChange={(e) => setData({ ...data, piece_id: e.target.value })}
                            >
                                <option value="">Saisir une pièce</option>
                                {pieces.map((piece) => (
                                    <option value={piece.id}>{piece.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Responsable</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="user_id"
                                value={data.user_id}
                                onChange={(e) => setData({ ...data, user_id: e.target.value })}
                            >
                                <option value="">Saisir un responsable</option>
                                {users.map((user) => (
                                    <option value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Composants</label>
                            {data.range_operations.map((range_operation, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-1">
                                    <select value={range_operation.operation_id} onChange={(e) => {
                                        const updatedRangeOperations = [...data.range_operations];
                                        updatedRangeOperations[index].operation_id = e.target.value;
                                        setData({ ...data, range_operations: updatedRangeOperations });
                                    }} className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                        <option value="">Sélectionner une opérations</option>
                                        {operations.map(operation => (
                                            <option key={operation.id} value={String(operation.id)}>{operation.name}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={() => {
                                        const updatedPieceRefs = data.range_operations.filter((_, i) => i !== index);
                                        setData({ ...data, range_operations: updatedPieceRefs });
                                    }} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedRangeOperations = [...data.range_operations, { operation_id: ''}];
                                setData({ ...data, range_operations: updatedRangeOperations });
                            }} className="mt-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter une opération</button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modification de gamme */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier la gamme</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pièce</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="piece_id"
                                value={data.piece_id}
                                onChange={(e) => setData({ ...data, piece_id: e.target.value })}
                            >
                                <option value="">Saisir une pièce</option>
                                {pieces.map((piece) => (
                                    <option value={piece.id}>{piece.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Responsable</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="user_id"
                                value={data.user_id}
                                onChange={(e) => setData({ ...data, user_id: e.target.value })}
                            >
                                <option value="">Saisir un responsable</option>
                                {users.map((user) => (
                                    <option value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Composants</label>
                            {data.range_operations.map((range_operation, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-1">
                                    <select value={range_operation.operation_id} onChange={(e) => {
                                        const updatedRangeOperations = [...data.range_operations];
                                        updatedRangeOperations[index].operation_id = e.target.value;
                                        setData({ ...data, range_operations: updatedRangeOperations });
                                    }} className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                        <option value="">Sélectionner une opérations</option>
                                        {operations.map(operation => (
                                            <option key={operation.id} value={String(operation.id)}>{operation.name}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={() => {
                                        const updatedPieceRefs = data.range_operations.filter((_, i) => i !== index);
                                        setData({ ...data, range_operations: updatedPieceRefs });
                                    }} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedRangeOperations = [...data.range_operations, { operation_id: ''}];
                                setData({ ...data, range_operations: updatedRangeOperations });
                            }} className="mt-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter une opération</button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Modifier</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Suppression de gamme */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg">
                    <h2 className="text-2xl font-semibold mb-4">Confirmer la suppression de la gamme</h2>
                    <p className="text-gray-700 mb-4">Êtes-vous sûr de vouloir supprimer cette gamme ? Cette action est irréversible.</p>
                    <div className="flex justify-end">
                        <button onClick={closeModals} className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-300">Annuler</button>
                        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300">Supprimer</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
