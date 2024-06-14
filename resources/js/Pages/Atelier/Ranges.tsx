import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {PageProps } from '@/types';
import React, {useState} from "react";
import { PencilIcon, SearchIcon, TrashIcon } from "lucide-react";

type Operation = {
    name: string;
    time: number;
    post: string;
    machine: string;
};

type Range = {
    id: number;
    name: string;
    responsible: string;
    operations: Operation[];
};

export default function Ranges({ auth }:PageProps) {
    const [ranges, setRanges] = useState<Range[]>([
        {
            id: 1,
            name: "Gamme - Pièce X",
            responsible: "John Doe",
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
            operations: [
                { name: "Couper la pièce", time: 30, post: "Scieur", machine: "Scie circulaire" },
                { name: "Percer les trous", time: 20, post: "Perceur", machine: "Perceuse" },
                { name: "Assembler les éléments", time: 40, post: "Assembleur", machine: "Assembleuse" },
            ]
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRange, setSelectedRange] = useState<Range | null>(null);
    const [isProduceModalOpen, setIsProduceModalOpen] = useState<boolean>(false);

    const addRange = () => {
        const newRange: Range = {
            id: Math.random(),
            name: "Nouvelle Gamme",
            responsible: "Nouveau Responsable",
            operations: []
        };
        setRanges([...ranges, newRange]);
    };

    const editRange = (id: number) => {
        console.log("Modifier la gamme avec l'ID :", id);
    };

    const deleteRange = (id: number) => {
        const updatedRanges = ranges.filter((range) => range.id !== id);
        setRanges(updatedRanges);
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
                        {ranges.map((range) => (
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
                                        <h2 className="text-xl font-semibold">{range.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Responsable : {range.responsible}</span>
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

                    {/* Nouvelle Modal pour produire */}
                    {isProduceModalOpen && selectedRange && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-8 max-w-md overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4">{selectedRange.name}</h2>
                                {selectedRange.operations.map((operation, index) => (
                                    <div key={index} className="bg-gray-100 rounded-md p-4 mb-4">
                                        <h3 className="text-lg font-semibold">{operation.name}</h3>
                                        <div className={"flex"}>
                                            <p>Temps : </p>
                                            <input type={"text"} value={operation.time} />
                                        </div>
                                        <div className={"flex"}>
                                            <p>Poste : </p>
                                            <select>
                                                <option>Poste 1</option>
                                                <option>Poste 2</option>
                                            </select>
                                        </div>
                                        <div className={"flex"}>
                                            <p>Machine : </p>
                                            <select>
                                                <option> Machine 1</option>
                                                <option> Machine 2</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={closeProduceModal} className="mt-4 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">
                                    Produire
                                </button>
                                <button onClick={closeProduceModal} className="mt-4 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">
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
