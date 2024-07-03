import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps, Piece, User } from '@/types';
import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {Inertia} from "@inertiajs/inertia";

export interface OrderPiece {
    id: number,
    piece_id: number,
    order_id: number,
    price: number,
    quantity: number,
    piece: Piece,
}

export interface Order {
    id: number;
    date: string;
    user_id: number;
    pieces: OrderPiece[];
    client: Client;
}
export interface Client {
    id: number,
    name: string
}

interface OrdersProps extends PageProps {
    orders: Order[]
}

const Orders: React.FC<OrdersProps> = ({ auth, orders }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setFilteredOrders(
            orders.filter(order =>
                order.client.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(1);
    }, [searchTerm, orders]);

    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleDownload = (id: number) => {
        Inertia.get(route('orders.download', id))
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Factures</h2>}
        >
            <Head title="Factures" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Rechercher par utilisateur"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Client</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Pièces</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedOrders.map(order => (
                                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{order.date}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{order.client.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                        {order.pieces.map((piece, index) => (
                                            <div key={index}>
                                                {piece.piece.name} ({piece.quantity} x {piece.price}€)
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => handleDownload(order.id)}
                                            className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white"
                                        >
                                            Télécharger PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, i) => (
                            <button key={i} className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </AuthenticatedLayout>
    );
}

export default Orders;
