import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps, Piece, User } from '@/types';
import React, { useState } from "react";
import { PencilIcon, SearchIcon, TrashIcon } from "lucide-react";
import {log} from "util";

type Post = {
    id: number,
    name: string
}

type Machine = {
    id: number,
    name: string
}

type Operation = {
    name: string;
    time: number;
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
    machines: Machine[]
}

export default function Ranges({ auth, ranges, posts, machines }: RangeProps) {
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

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const addRange = () => {
        console.log('add')
    };

    const editRange = (id: number) => {
        console.log("Modifier la gamme avec l'ID :", id);
    };

    const deleteRange = (id: number) => {
        console.log('delete')
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gammes</h2>}
        >
            <Head title="Gammes" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Nos gammes</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative w-full max-w-md">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Rechercher une gamme"
                                    type="text"
                                    value={searchTerm} // Ajout de la valeur de l'état de recherche
                                    onChange={handleSearchChange} // Ajout de la gestion de l'événement de changement
                                />
                            </div>
                            <button
                                onClick={addRange}
                                className="px-4 py-2 text-black border border-black rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                            >
                                Ajouter une gamme
                            </button>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        {currentItems.map((range) => (
                            <div key={range.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => editRange(range.id)}
                                            className="text-gray-500 hover:text-black focus:outline-none"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteRange(range.id)}
                                            className="text-gray-500 hover:text-black focus:outline-none"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
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
                                <h2 className="text-2xl font-semibold mb-4">{selectedRange.name}</h2>
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
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <p>Poste :</p>
                                                <select
                                                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                                >
                                                    {posts.map((post, index) => (
                                                        post.id === operation.post.id ?
                                                            (
                                                                <option selected value={post.id}>{post.name}</option>
                                                            ) : (
                                                                <option value={post.id}>{post.name}</option>
                                                            )
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <p>Machine :</p>
                                                <select
                                                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                                >
                                                    {machines.map((machine, index) => (
                                                        machine.id === operation.machine.id ?
                                                            (
                                                                <option selected value={machine.id}>{machine.name}</option>
                                                            ) : (
                                                                <option value={machine.id}>{machine.name}</option>
                                                            )
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-4 mt-4">
                                    <button
                                        onClick={closeProduceModal}
                                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                                    >
                                        Produire
                                    </button>
                                    <button
                                        onClick={closeProduceModal}
                                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
