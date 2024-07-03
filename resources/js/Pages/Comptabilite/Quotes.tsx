import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Piece, User } from '@/types';
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Client} from "@/Pages/Comptabilite/Orders";
export interface QuotePiece {
    id: number,
    price: number,
    quantity: number,
    piece_id: number,
    piece: Piece;
}
export interface Quote {
    id: number;
    date: string;
    date_limit: string;
    client_id: number;
    pieces: QuotePiece[];
    client: Client;
}
interface QuotesProps extends PageProps {
    quotes: Quote[];
    pieces: Piece[];
    piecesSelect: Piece[],
    clients: Client[]
}

export default function Quotes({ auth, quotes, pieces, piecesSelect, clients }: QuotesProps) {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQuotes, setFilteredQuotes] = useState(quotes);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedPiecesForOrder, setSelectedPiecesForOrder] = useState<{ piece_id: number, quantity: number, price: number }[]>([]);
    const [convertModalOpen, setConvertModalOpen] = useState(false);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quote[]>([]);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    const { data: updateData, setData: setUpdateData,put: putUpdate } = useForm({
        id: 0,
        date: '',
        date_limit: '',
        client_id: '',
        quote_pieces: [{ piece_id: '', price: 0, quantity: 1 }]
    });

    const { data: clientData, setData: setClientData,post: postClient } = useForm({
        name: "",
    });
    const openUpdateModal = (quote: Quote) => {
        setUpdateData({
            id: quote.id,
            date: quote.date,
            date_limit: quote.date_limit,
            client_id: String(quote.client_id),
            quote_pieces: quote.pieces.map(piece => ({
                piece_id: String(piece.piece_id),
                price: piece.price,
                quantity: piece.quantity
            }))
        });
        setUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
    };
    const closeClientModal = () => {
        setClientModalOpen(false);
    };

    const openClientModal = () => {
        setClientModalOpen(true);
    };

    const handleUpdate = (quoteId: number) => {
        putUpdate(route('quotes.update', quoteId), {
            onSuccess: () => {
                closeUpdateModal();
                toast.success('Devis modifié avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la modification du devis.');
            }
        });
    };

    const { data, setData,post: postCreate } = useForm({
        date: '',
        date_limit: '',
        client_id: '',
        quote_pieces: [{ piece_id: '', price: 0, quantity: 1 }]
    });

    const { data: convertData, setData: setConvertData, post: postConvert } = useForm({
        client_id: 0,
        pieces: [] as { piece_id: number; quantity: number; price: number }[]
    });

    useEffect(() => {
        setFilteredQuotes(
            quotes.filter(quote =>
                quote.client.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(1);
    }, [searchTerm, quotes]);

    const openCreateModal = () => {
        setData({ date: '', date_limit: '', client_id: '', quote_pieces: [{ piece_id: '', price: 0, quantity: 1 }] });
        setCreateModalOpen(true);
    };

    const closeModals = () => {
        setCreateModalOpen(false);
    };

    const handleCreate = () => {
        postCreate(route('quotes.store'), {
            onSuccess: () => {
                closeModals();
                toast.success('Devis ajouté avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de l\'ajout du devis.');
            }
        });
    };

    const paginatedQuotes = filteredQuotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    const handleConvertToInvoice = () => {
        // setSelectedPieces(quote.pieces.map(piece => ({ piece_id: piece.piece_id, quantity: piece.quantity, price: piece.price })));
        setConvertModalOpen(true);
    };

    const handleCreateClient = () => {
        postClient(route('clients.store'),{
            data: {
                name: clientData.name
            },onSuccess: () => {
                setClientModalOpen(false);
                toast.success('Client créée avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la création du client.');
            }
        })
    }

    const handleConvertToInvoiceSubmit = () => {
        postConvert(route('orders.store'), {
            data: {
                client_id: convertData.client_id,
                pieces: selectedPiecesForOrder
            },
            onSuccess: () => {
                setConvertModalOpen(false);
                toast.success('Facture créée avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la création de la facture.');
            }
        });
    };



    const handlePieceSelection = (pieceId: number, quantity: number, price: number, selected: boolean) => {
        let updatedPiecesForOrder = [...selectedPiecesForOrder];

        if (selected) {
            updatedPiecesForOrder.push({ piece_id: pieceId, quantity: quantity, price: price });
        } else {
            updatedPiecesForOrder = updatedPiecesForOrder.filter(piece => !(piece.piece_id === pieceId && piece.quantity === quantity && piece.price === price));
        }

        setSelectedPiecesForOrder(updatedPiecesForOrder);

        setConvertData((prevData) => ({
            ...prevData,
            pieces: updatedPiecesForOrder
        }));
    };

    const closeConvertModal = () => {
        setConvertModalOpen(false)
        setConvertData({
            client_id: 0,
            pieces: []
        })
        setSelectedPiecesForOrder([]);
        setSelectedQuote([])
    }

    const changeUserForm = (client_id:number) => {
        const filteredQuotes = quotes.filter(quote => quote.client_id === client_id
            // && new Date(quote.date_limit) >= new Date()
        );
        setSelectedPiecesForOrder([])
        setSelectedQuote([])
        setSelectedQuote(filteredQuotes);
        setConvertData({ ...convertData, client_id: client_id, pieces: []});
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Devis</h2>}
        >
            <Head title="Quotes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Rechercher par client"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <div>
                            <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white mr-2" onClick={handleConvertToInvoice}>
                                Convertir en facture
                            </button>
                            <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white" onClick={openCreateModal}>
                                Ajouter un devis
                            </button>
                            <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white ml-2" onClick={openClientModal}>
                                Ajouter un client
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Date Limite</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Utilisateur</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Pièces</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedQuotes.map(quote => (
                                <tr key={quote.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{quote.date}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{quote.date_limit}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{quote.client.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                        {quote.pieces.map(piece => (
                                            <div key={piece.id}>
                                                {pieces.find(p => p.id === piece.piece_id)?.name}  {piece.piece.name} ({piece.quantity} x {piece.price}€)
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                        {!quote.date_limit && (
                                            <button
                                                onClick={() => openUpdateModal(quote)}
                                                className="border border-solid border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 bg-white"
                                            >
                                                Modifier
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredQuotes.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Création de devis */}
            <Modal isOpen={isCreateModalOpen} onRequestClose={closeModals} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Créer un devis</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date Limite</label>
                            <input type="date" value={data.date_limit} onChange={(e) => setData({ ...data, date_limit: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Client</label>
                            <select value={data.client_id} onChange={(e) => setData({ ...data, client_id: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Sélectionner un client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={String(client.id)}>{client.name}</option>
                                ))}
                            </select>                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pièces</label>
                            {data.quote_pieces.map((quotePiece, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-1">
                                    <select value={quotePiece.piece_id} onChange={(e) => {
                                        const updatedQuotePieces = [...data.quote_pieces];
                                        updatedQuotePieces[index].piece_id = e.target.value;
                                        setData({ ...data, quote_pieces: updatedQuotePieces });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                        <option value="">Sélectionner une pièce</option>
                                        {piecesSelect.map(piece => (
                                            <option key={piece.id} value={String(piece.id)}>{piece.name}</option>
                                        ))}
                                    </select>
                                    <label>Quantité</label>
                                    <input type="number" value={quotePiece.quantity} onChange={(e) => {
                                        const updatedQuotePieces = [...data.quote_pieces];
                                        updatedQuotePieces[index].quantity = Number(e.target.value);
                                        setData({ ...data, quote_pieces: updatedQuotePieces });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                                    <label>Prix</label>
                                    <input type="number" value={quotePiece.price} onChange={(e) => {
                                        const updatedQuotePieces = [...data.quote_pieces];
                                        updatedQuotePieces[index].price = Number(e.target.value);
                                        setData({ ...data, quote_pieces: updatedQuotePieces });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                                    {
                                        index !== 0 && (
                                            <button type="button" onClick={() => {
                                                const updatedQuotePieces = data.quote_pieces.filter((_, i) => i !== index);
                                                setData({ ...data, quote_pieces: updatedQuotePieces });
                                            }} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                                        )
                                    }
                                </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedQuotePieces = [...data.quote_pieces, { piece_id: '', price: 0, quantity: 1 }];
                                setData({ ...data, quote_pieces: updatedQuotePieces });
                            }} className="mt-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter une pièce</button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModals} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={clientModalOpen} onRequestClose={closeClientModal} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Ajouter un client</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateClient(); }}>
                        <div className="overflow-x-auto">
                            <div className="mb-4 ml-1">
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    required
                                    onChange={(e) => setClientData({...clientData, name: e.target.value})}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={closeClientModal} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter un client</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={convertModalOpen} onRequestClose={closeConvertModal} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Convertir en facture</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleConvertToInvoiceSubmit(); }}>
                        <div className="overflow-x-auto">
                            <div className="mb-4 ml-1">
                                <label className="block text-sm font-medium text-gray-700">Client</label>
                                <select
                                    onChange={(e) => changeUserForm(Number(e.target.value))}
                                    required
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Sélectionner un client</option>
                                    {clients.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <table className="w-full table-auto border-collapse bg-white">
                                <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Pièce</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Quantité</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Prix</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Sélectionner</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedQuote.length > 0 ? (
                                    selectedQuote.map(quote => (
                                        <>
                                            {quote.pieces.map((piece, index) => {
                                                const isSelected = selectedPiecesForOrder.some(selectedPiece => selectedPiece.piece_id === piece.piece_id);
                                                const isCurrentPieceSelected = selectedPiecesForOrder.some(selectedPiece => selectedPiece.piece_id === piece.piece_id && selectedPiece.quantity === piece.quantity && selectedPiece.price === piece.price);

                                                return (
                                                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                        <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{piecesSelect.find(p => p.id === piece.piece_id)?.name}</td>
                                                        <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{piece.quantity}</td>
                                                        <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{piece.price}</td>
                                                        <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => handlePieceSelection(piece.piece_id, piece.quantity, piece.price, e.target.checked)}
                                                                checked={isCurrentPieceSelected}
                                                                disabled={isSelected && !isCurrentPieceSelected}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">Aucun devis existe pour ce client</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={closeConvertModal} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Créer la facture</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/*update modal*/}
            <Modal isOpen={isUpdateModalOpen} onRequestClose={closeUpdateModal} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier le devis</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(updateData.id); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={updateData.date} onChange={(e) => setUpdateData({ ...updateData, date: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date Limite</label>
                            <input type="date" value={updateData.date_limit} onChange={(e) => setUpdateData({ ...updateData, date_limit: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Client</label>
                            <select value={updateData.client_id} onChange={(e) => setUpdateData({ ...updateData, client_id: e.target.value })} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Sélectionner un client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={String(client.id)}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pièces</label>
                            {updateData.quote_pieces.map((quotePiece, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-1">
                                    <select value={quotePiece.piece_id} onChange={(e) => {
                                        const updatedQuotePieces = [...updateData.quote_pieces];
                                        updatedQuotePieces[index].piece_id = e.target.value;
                                        setUpdateData({ ...updateData, quote_pieces: updatedQuotePieces });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                        <option value="">Sélectionner une pièce</option>
                                        {piecesSelect.map(piece => (
                                            <option key={piece.id} value={String(piece.id)}>{piece.name}</option>
                                        ))}
                                    </select>
                                    <label>Quantité</label>
                                    <input type="number" value={quotePiece.quantity} onChange={(e) => {
                                        const updatedQuotePieces = [...updateData.quote_pieces];
                                        updatedQuotePieces[index].quantity = Number(e.target.value);
                                        setUpdateData({ ...updateData, quote_pieces: updatedQuotePieces });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                                    <label>Prix</label>
                                    <input type="number" value={quotePiece.price} onChange={(e) => {
                                        const updatedQuotePieces = [...updateData.quote_pieces];
                                        updatedQuotePieces[index].price = Number(e.target.value);
                                        setUpdateData({ ...updateData, quote_pieces: updatedQuotePieces });
                                    }} required className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                                    {
                                        index !== 0 && (
                                            <button type="button" onClick={() => {
                                                const updatedQuotePieces = updateData.quote_pieces.filter((_, i) => i !== index);
                                                setUpdateData({ ...updateData, quote_pieces: updatedQuotePieces });
                                            }} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                                        )
                                    }
                                </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedQuotePieces = [...updateData.quote_pieces, { piece_id: '', price: 0, quantity: 1 }];
                                setUpdateData({ ...updateData, quote_pieces: updatedQuotePieces });
                            }} className="mt-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter une pièce</button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeUpdateModal} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Modifier</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <ToastContainer />
        </AuthenticatedLayout>
    );
}
