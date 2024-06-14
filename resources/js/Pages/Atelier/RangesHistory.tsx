import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {PageProps } from '@/types';
import React, {useState} from "react";
import { SearchIcon } from "lucide-react";

type Operation = {
    name: string;
    time: number;
    post: string;
    machine: string;
};

type Range = {
    id: number;
    name: string;
    date : string;
    responsible: string;
    operations: Operation[];
};

export default function RangesHistory({ auth }:PageProps) {
    const [ranges, setRanges] = useState<Range[]>([
        {
            id: 1,
            name: "Gamme - Pièce X",
            responsible: "John Doe",
            date: "01/01/2000",
            operations: [
                { name: "Couper la pièce", time: 30, post: "Scieur", machine: "Scie circulaire" },
                { name: "Percer les trous", time: 20, post: "Perceur", machine: "Perceuse" },
                { name: "Assembler les éléments", time: 40, post: "Assembleur", machine: "Assembleuse" },
            ]
        },
        {
            id: 2,
            name: "Gamme - Pièce Y",
            responsible: "John Doe",
            date: "01/01/2000",
            operations: [
                { name: "Couper la pièce", time: 30, post: "Scieur", machine: "Scie circulaire" },
                { name: "Percer les trous", time: 20, post: "Perceur", machine: "Perceuse" },
                { name: "Assembler les éléments", time: 40, post: "Assembleur", machine: "Assembleuse" },
            ]
        },
        {
            id: 3,
            name: "Gamme - Pièce Z",
            responsible: "John Doe",
            date: "01/01/2000",
            operations: [
                { name: "Couper la pièce", time: 30, post: "Scieur", machine: "Scie circulaire" },
                { name: "Percer les trous", time: 20, post: "Perceur", machine: "Perceuse" },
                { name: "Assembler les éléments", time: 40, post: "Assembleur", machine: "Assembleuse" },
            ]
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRange, setSelectedRange] = useState<Range | null>(null);

    const openModal = (range: Range) => {
        setSelectedRange(range);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                        <h1 className="text-3xl font-bold">Historique des gammes</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative w-full max-w-md">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Rechercher une gamme"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        {ranges.map((range) => (
                            <div key={range.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold">{range.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Responsable : {range.responsible}</span>
                                    </div>
                                </div>
                                <p>{range.date}</p>
                                <button onClick={() => openModal(range)} className="mt-4 px-3 py-1 border border-black text-black rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                                    Détails des opérations
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Modal pour afficher les détails des opérations */}
                    {isModalOpen && selectedRange && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-md overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4">{selectedRange.name}</h2>
                                {selectedRange.operations.map((operation, index) => (
                                    <div key={index} className="bg-gray-100 rounded-md p-4 mb-4">
                                        <h3 className="text-lg font-semibold">{operation.name}</h3>
                                        <p>Temps : {operation.time} min</p>
                                        <p>Poste : {operation.post}</p>
                                        <p>Machine : {operation.machine}</p>
                                    </div>
                                ))}
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
