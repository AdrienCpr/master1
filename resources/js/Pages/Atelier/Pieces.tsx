import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps, PieceRef, Range } from '@/types';
import React, { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export interface Piece {
    id: number;
    ref: string;
    name: string;
    type: string;
    price: number;
    ranges: Range[]
    pieces_to_create: Piece[]
}

interface PiecesProps extends PageProps {
    pieces: Piece[];
    piecesRef: PieceRef[];
}

export default function Pieces({ auth, pieces, piecesRef }: PiecesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);

    const { data, setData, post, put, delete: destroy } = useForm({
        ref: '',
        name: '',
        type: '',
        price: 0,
        piece_refs: [{ piece_need_id: '', quantity: 1 }]
    });

    const openCreateModal = () => {
        setData({ ref: '', name: '', type: '', price: 0, piece_refs: [{ piece_need_id: '', quantity: 1 }] });
        setCreateModalOpen(true);
    };

    const openEditModal = (piece: Piece) => {
        setData({
            ref: piece.ref,
            name: piece.name,
            type: piece.type,
            price: piece.price,
            piece_refs: piecesRef.filter(ref => ref.piece_to_create_id === piece.id).map(ref => ({
                piece_need_id: String(ref.piece_need_id),
                quantity: ref.quantity
            }))
        });
        setCurrentPiece(piece);
        setEditModalOpen(true);
    };

    const openDeleteModal = (piece: Piece) => {
        setCurrentPiece(piece);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
    };

    const handleCreate = () => {
        post(route('pieces.store'), {
            onSuccess: () => {
                closeModals();
                toast.success('Pièce ajoutée avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de l\'ajout de la pièce.');
            }
        });
    };

    const handleUpdate = () => {
        if (currentPiece) {
            put(route('pieces.update', currentPiece.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Modification enregistrée avec succès!');
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la modification de la pièce.');
                }
            });
        }
    };

    const handleDelete = () => {
        if (currentPiece) {
            destroy(route('pieces.destroy', currentPiece.id), {
                onSuccess: () => {
                    closeModals();
                    toast.success('Pièce supprimée avec succès!');
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la suppression de la pièce.');
                }
            });
        }
    };

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pièces</h2>}
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
                        <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white" onClick={openCreateModal}>
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
                                    <td className="px-4 py-3 text-right border border-gray-200 dark:border-gray-700">{piece.price}€</td>
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
                                        <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => openEditModal(piece)}><FaEdit /></button>
                                        {piece.ranges.length === 0 && piece.pieces_to_create.length === 0 && (
                                            <button className="text-red-500 hover:text-red-700" onClick={() => openDeleteModal(piece)}><FaTrash /></button>
                                        )}
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

            {/* Création de pièce */}
            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer une pièce</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Référence</label>
                            <input type="text" value={data.ref} onChange={(e) => setData({ ...data, ref: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type"
                                value={data.type}
                                required
                                onChange={(e) => setData({ ...data, type: e.target.value })}
                            >
                                <option value="">Saisir un type</option>
                                <option value="fabriqué">fabriqué</option>
                                <option value="matières premières">matières premières</option>
                                <option value="acheté">acheté</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Prix</label>
                            <input type="number" value={data.price} aria-required onChange={(e) => setData({ ...data, price: Number(e.target.value) })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Composants</label>
                            {data.piece_refs.map((ref, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-1">
                                    <select value={ref.piece_need_id} onChange={(e) => {
                                        const updatedPieceRefs = [...data.piece_refs];
                                        updatedPieceRefs[index].piece_need_id = e.target.value;
                                        setData({ ...data, piece_refs: updatedPieceRefs });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                        <option value="">Sélectionner un composant</option>
                                        {pieces.map(piece => (
                                            <option key={piece.id} value={String(piece.id)}>{piece.name}</option>
                                        ))}
                                    </select>
                                    <input type="number" value={ref.quantity} onChange={(e) => {
                                        const updatedPieceRefs = [...data.piece_refs];
                                        updatedPieceRefs[index].quantity = Number(e.target.value);
                                        setData({ ...data, piece_refs: updatedPieceRefs });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                                    <button type="button" onClick={() => {
                                        const updatedPieceRefs = data.piece_refs.filter((_, i) => i !== index);
                                        setData({ ...data, piece_refs: updatedPieceRefs });
                                    }} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedPieceRefs = [...data.piece_refs, { piece_need_id: '', quantity: 1 }];
                                setData({ ...data, piece_refs: updatedPieceRefs });
                            }} className="mt-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter un composant</button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Édition de pièce */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier la pièce</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Référence</label>
                            <input type="text" aria-required value={data.ref} onChange={(e) => setData({ ...data, ref: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" aria-required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type"
                                value={data.type}
                                required
                                onChange={(e) => setData({ ...data, type: e.target.value })}
                            >
                                <option value="">Saisir un type</option>
                                <option value="fabriqué">fabriqué</option>
                                <option value="matières premières">matières premières</option>
                                <option value="acheté">acheté</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Prix</label>
                            <input type="number" aria-required value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Composants</label>
                            {data.piece_refs.map((ref, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-1">
                                    <select value={ref.piece_need_id} onChange={(e) => {
                                        const updatedPieceRefs = [...data.piece_refs];
                                        updatedPieceRefs[index].piece_need_id = e.target.value;
                                        setData({ ...data, piece_refs: updatedPieceRefs });
                                    }}
                                        required
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                        <option value="">Sélectionner un composant</option>
                                        {pieces.map(piece => (
                                            <option key={piece.id} value={String(piece.id)}>{piece.name}</option>
                                        ))}
                                    </select>
                                    <input type="number" value={ref.quantity} onChange={(e) => {
                                        const updatedPieceRefs = [...data.piece_refs];
                                        updatedPieceRefs[index].quantity = Number(e.target.value);
                                        setData({ ...data, piece_refs: updatedPieceRefs });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                                    <button type="button" onClick={() => {
                                        const updatedPieceRefs = data.piece_refs.filter((_, i) => i !== index);
                                        setData({ ...data, piece_refs: updatedPieceRefs });
                                    }} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedPieceRefs = [...data.piece_refs, { piece_need_id: '', quantity: 1 }];
                                setData({ ...data, piece_refs: updatedPieceRefs });
                            }} className="mt-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter un composant</button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Enregistrer les modifications</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Suppression de pièce */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg">
                    <h2 className="text-2xl font-semibold mb-4">Confirmer la suppression de la pièce</h2>
                    <p className="text-gray-700 mb-4">Êtes-vous sûr de vouloir supprimer cette pièce ? Cette action est irréversible.</p>
                    <div className="flex justify-end">
                        <button onClick={closeModals} className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-300">Annuler</button>
                        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300">Supprimer</button>
                    </div>
                </div>
            </Modal>
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
