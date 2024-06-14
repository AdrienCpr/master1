import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {PageProps, Piece, PieceRef} from '@/types';
import { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';

interface PiecesProps extends PageProps {
    pieces: Piece[];
    piecesRef: PieceRef[];
}
export default function Pieces({ auth, pieces, piecesRef }:PiecesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredPieces = pieces.filter(piece =>
        piece.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        piece.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPieces = filteredPieces.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pieces Atelier</h2>}
        >
            <Head title="Pieces" />

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
                        <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white" onClick={() => alert("Ajouter une pièce")}>
                            Ajouter une pièce
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Référence</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Nom</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Type</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Prix</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Composants</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPieces.map(piece => (
                                <tr key={piece.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{piece.ref}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{piece.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{piece.type}</td>
                                    <td className="px-4 py-3 text-right border border-gray-200 dark:border-gray-700">${piece.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right border border-gray-200 dark:border-gray-700">
                                        {piecesRef
                                            .filter(ref => ref.piece_to_create_id === piece.id)
                                            .map(ref => (
                                                <div key={ref.id}>
                                                    {pieces.find(p => p.id === ref.piece_need_id)?.name} x{ref.quantity}
                                                </div>
                                            ))}
                                    </td>
                                    <td className="px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                                        <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => alert("Modifier la pièce")}><FaEdit /></button>
                                        <button className="text-red-500 hover:text-red-700" onClick={() => alert("Supprimer la pièce")}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredPieces.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
