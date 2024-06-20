import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import React, { useState } from "react";
import { SearchIcon } from "lucide-react";

type Machine = {
    id: number;
    name: string;
};

type Post = {
    id: number;
    name: string;
};

type Operation = {
    id: number;
    name: string;
};

type RangeProduceOperation = {
    id: number;
    machine: Machine;
    operation: Operation;
    post: Post;
    time: string;
};

type Range = {
    id: number;
    name: string;
    user: { name: string };
    piece: { name: string };
    created_at: string;
};

type RangeProduce = {
    id: number;
    range: Range;
    range_produce_operations: RangeProduceOperation[];
};

type Props = PageProps & {
    rangesProduce: RangeProduce[];
};

export default function RangesHistory({ auth, rangesProduce }: Props) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRangeProduce, setSelectedRangeProduce] = useState<RangeProduce | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // État pour la chaîne de recherche
    const itemsPerPage = 3;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Réinitialiser la page courante à 1 lors de la recherche
    };

    const filteredRangesProduce = rangesProduce.filter((rangeProduce) =>
        rangeProduce.range.piece.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rangeProduce.range.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRangesProduce.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRangesProduce.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const openModal = (rangeProduce: RangeProduce) => {
        setSelectedRangeProduce(rangeProduce);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRangeProduce(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historique des gammes</h2>}
        >
            <Head title="Gammes" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
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
                        </div>
                    </div>
                    <div className="grid gap-8">
                        {currentItems.map((rangeProduce) => (
                            <div key={rangeProduce.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold">{rangeProduce.range.piece.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Responsable : {rangeProduce.range.user.name}</span>
                                    </div>
                                </div>
                                <p>{new Date(rangeProduce.range.created_at).toLocaleDateString()}</p>
                                <button onClick={() => openModal(rangeProduce)} className="mt-4 px-3 py-1 border border-black text-black rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
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
                    {isModalOpen && selectedRangeProduce && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-3xl overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4">{selectedRangeProduce.range.piece.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {selectedRangeProduce.range_produce_operations && selectedRangeProduce.range_produce_operations.length > 0 ? (
                                        selectedRangeProduce.range_produce_operations.map((operation, index) => (
                                            <div key={index} className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold">{operation.operation.name}</h3>
                                                <p className="text-sm">Temps : {operation.time}</p>
                                                <p className="text-sm">Poste : {operation.post.name}</p>
                                                <p className="text-sm">Machine : {operation.machine.name}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Aucune opération disponible.</p>
                                    )}
                                </div>
                                <button onClick={closeModal} className="mt-4 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
