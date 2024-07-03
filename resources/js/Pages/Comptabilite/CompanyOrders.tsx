import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import {PageProps, Piece, User} from '@/types';
import React, {useState, useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {Inertia} from "@inertiajs/inertia";
import Modal from "react-modal";
import Papa from 'papaparse';

export interface CompanyOrderPiece {
    id: number,
    piece_id: number,
    company_order_id: number,
    price: number,
    quantity: number,
    piece: Piece,
}

export interface CompanyOrder {
    id: number;
    date: string;
    delivery_date: string;
    real_delivery_date: string;
    supplier_id: number;
    supplier: Supplier;
    pieces: CompanyOrderPiece[];
}

export interface Supplier {
    id: number,
    name: string
}

interface CompanyOrdersProps extends PageProps {
    companyOrders: CompanyOrder[]
    suppliers: Supplier[]
    pieces: Piece[]
}

const CompanyOrders: React.FC<CompanyOrdersProps> = ({auth, companyOrders, suppliers, pieces}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanyOrders, setFilteredCompanyOrders] = useState<CompanyOrder[]>(companyOrders);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
    const itemsPerPage = 5;
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [supplierModalOpen, setSupplierModalOpen] = useState(false);

    const { data: supplierData, setData: setSupplierData,post: postSupplier } = useForm({
        name: "",
    });    const handleDownload = () => {
        downloadCSV();
        // handleDownloadCSV(date);
    };
    const openDownloadModal = () => {
        const getPreviousMonth = () => {
            const now = new Date();
            const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            return previousMonth.toLocaleString('default', { month: 'long' }).toLowerCase();
        };

        const previousMonth = getPreviousMonth();
        setSelectedMonths([previousMonth]);
        setDownloadModalOpen(true);
    };

    const closeDownloadModal = () => {
        setDownloadModalOpen(false);
    };

    const closeSupplierModal = () => {
        setSupplierModalOpen(false);
    };

    const {data: addData, setData: setAddData, post: postAdd} = useForm({
        date: '',
        delivery_date: '',
        real_delivery_date: "",
        supplier_id: "",
        company_orders_pieces: [{piece_id: '', price: 0, quantity: 1}]
    });
    const {data: updateData, setData: setUpdateData, put: putUpdate} = useForm({
        id: 0,
        date: '',
        delivery_date: '',
        real_delivery_date: "",
        supplier_id: "",
        company_orders_pieces: [{piece_id: '', price: 0, quantity: 1}]
    });

    useEffect(() => {
        setFilteredCompanyOrders(
            companyOrders.filter(companyOrder =>
                companyOrder.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(1);
    }, [searchTerm, companyOrders]);

    const openDeleteModal = (id: number) => {
        setDeleteCompanyId(id);
        setDeleteModalOpen(true);
    };

    const paginatedCompanyOrders = filteredCompanyOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleUpdate = (id: number) => {
        console.log(id)
        putUpdate(route('company-orders.update', id), {
            onSuccess: () => {
                closeUpdateModal();
                toast.success("La commande a été modifiée avec succès!");
            },
            onError: (errors) => {
                toast.error("Erreur lors de la modification de la commande");
            }
        });
    }

    const handleDelete = () => {
        console.log(deleteCompanyId)
        if (deleteCompanyId) {
            Inertia.delete(route('company-orders.destroy', deleteCompanyId), {
                onSuccess: () => {
                    toast.success("La commande a été supprimée avec succès!");
                },
                onError: (errors) => {
                    toast.error("Erreur lors de la suppression de la commande");
                }
            });
        }
    }

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };
    const openUpdateModal = (companyOrder: CompanyOrder) => {
        setUpdateData({
            id: companyOrder.id,
            date: companyOrder.date,
            delivery_date: companyOrder.delivery_date,
            real_delivery_date: companyOrder.real_delivery_date,
            supplier_id: companyOrder.supplier_id.toString(),
            company_orders_pieces: companyOrder.pieces.map(piece => ({
                piece_id: piece.piece_id.toString(),
                price: piece.price,
                quantity: piece.quantity
            }))
        });
        setUpdateModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };

    const openSupplierModal = () => {
        setSupplierData({
            name: ''
        });
        setSupplierModalOpen(true);
    };

    const openAddModal = () => {
        setAddData({
            date: '',
            delivery_date: '',
            real_delivery_date: '',
            supplier_id: '',
            company_orders_pieces: [{ piece_id: '', price: 0, quantity: 1 }]
        });
        setAddModalOpen(true);
    };

    const handleAdd = () => {
        postAdd(route('company-orders.store'), {
            onSuccess: () => {
                closeAddModal();
                toast.success("La commande a été ajoutée avec succès!");
            },
            onError: (errors) => {
                toast.error("Erreur lors de l'ajout de la commande");
            }
        });
    }

    const handleAddPiece = () => {
        setAddData({
            ...addData,
            company_orders_pieces: [...addData.company_orders_pieces, { piece_id: '', price: 0, quantity: 1 }]
        });
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const month = e.target.value;
        setSelectedMonths(prevState =>
            prevState.includes(month) ? prevState.filter(m => m !== month) : [...prevState, month]
        );
    };

    const filterData = () => {
        const selectedMonthIndices = selectedMonths.map(month => months.indexOf(month));
        return companyOrders.filter(order => {
            const orderDate = new Date(order.date);
            const orderYear = orderDate.getFullYear();
            const orderMonthIndex = orderDate.getMonth();
            return selectedYear === orderYear && selectedMonthIndices.includes(orderMonthIndex);
        });
    };

    const generateCSV = () => {
        const filteredData = filterData();

        if (filteredData.length === 0) {
            toast.error("Vous n'avez aucun achat pour le(s) mois séléctionné(s)")
            return '';
        }

        const calculateTotal = (quantities: number[], prices: number[]): number => {
            return quantities.reduce((sum, quantity, index) => sum + quantity * prices[index], 0);
        };

        const csvData = filteredData.map(order => {
            const pieces = order.pieces.map((piece: any) => piece.piece.name).join('; ');
            const quantities = order.pieces.map((piece: any) => piece.quantity).join('; ');
            const prices = order.pieces.map((piece: any) => piece.price).join('; ');

            return {
                'Order ID': order.id,
                'Order Date': new Date(order.date).toLocaleDateString('fr-CA'),
                'Supplier Name': order.supplier.name,
                'Planned Delivery Date': new Date(order.delivery_date).toLocaleDateString('fr-CA') || 'N/A',
                'Actual Delivery Date': new Date(order.real_delivery_date).toLocaleDateString('fr-CA') || 'N/A',
                'Pieces': pieces,
                'Quantities': quantities,
                'Prices': prices,
                'Total': calculateTotal(order.pieces.map((piece: any) => piece.quantity), order.pieces.map((piece: any) => piece.price)) + '€',
            };
        });

        const headers = [
            'Order ID',
            'Order Date',
            'Supplier Name',
            'Planned Delivery Date',
            'Actual Delivery Date',
            'Pieces',
            'Quantities',
            'Prices',
            'Total',
        ];

        const csvContent = Papa.unparse({
            fields: headers,
            data: csvData
        });

        const csvWithTotal = `${csvContent}`;

        return csvWithTotal;
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const months = [
        "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
        "août", "septembre", "octobre", "novembre", "décembre"
    ];

    const downloadCSV = () => {
        const csv = generateCSV();
        if (!csv) return;
        const monthString = Array.isArray(selectedMonths)
            ? selectedMonths.join('_')
            : selectedMonths || 'AllMonths';
        const filename = `orders_${selectedYear}_${monthString}.csv`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSelectedMonths([]);
    };

    const handleCreateSupplier = () => {
        postSupplier(route('suppliers.store'),{
            data: {
                name: supplierData.name
            },onSuccess: () => {
                setSupplierModalOpen(false);
                toast.success('Fournisseur créée avec succès!');
            },
            onError: (errors) => {
                toast.error('Erreur lors de la création du fournisseur.');
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Commandes Entreprises</h2>}
        >
            <Head title="Commandes Entreprises"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Rechercher par fournisseur"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <div>
                            <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white mr-2" onClick={openDownloadModal}>
                                Excel
                            </button>
                            <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white mr-2" onClick={openAddModal}>
                                Ajouter un achat
                            </button>
                            <button className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white" onClick={openSupplierModal}>
                                Ajouter un fournisseur
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Date
                                    de livraison estimée
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Date
                                    de livraison
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Fournisseur</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Pièces</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedCompanyOrders.map(companyOrder => (
                                <tr key={companyOrder.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{companyOrder.date}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{companyOrder.delivery_date}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{companyOrder.real_delivery_date}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">{companyOrder.supplier.name}</td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                        {companyOrder.pieces.map((piece, index) => (
                                            <div key={index}>
                                                {piece.piece.name} ({piece.quantity} x {piece.price}€)
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-left border border-gray-200 dark:border-gray-700">
                                        {companyOrder.real_delivery_date === null && (
                                            <div>
                                                <button
                                                    onClick={() => openUpdateModal(companyOrder)}
                                                    className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white mr-2"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(companyOrder.id)}
                                                    className="border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end">
                        {Array.from({length: Math.ceil(filteredCompanyOrders.length / itemsPerPage)}, (_, i) => (
                            <button key={i}
                                    className="mx-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/*add Modal*/}
            <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} ariaHideApp={false}
                   className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Ajouter une commande entreprise</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={addData.date}
                                   onChange={(e) => setAddData({...addData, date: e.target.value})} required
                                   className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date de livraison estimée</label>
                            <input type="date" value={addData.delivery_date}
                                   onChange={(e) => setAddData({...addData, delivery_date: e.target.value})} required
                                   className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date de livraison</label>
                            <input type="date" value={addData.real_delivery_date}
                                   onChange={(e) => setAddData({...addData, real_delivery_date: e.target.value})}
                                   className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                            <select value={addData.supplier_id}
                                    onChange={(e) => setAddData({...addData, supplier_id: e.target.value})} required
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Sélectionner un fournisseur</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pièces</label>
                            {addData.company_orders_pieces.map((piece, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <select
                                        value={piece.piece_id}
                                        onChange={(e) => {
                                            const updatedPieces = [...addData.company_orders_pieces];
                                            updatedPieces[index].piece_id = e.target.value;
                                            setAddData({...addData, company_orders_pieces: updatedPieces});
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 mr-2"
                                    >
                                        <option value="">Sélectionner une pièce</option>
                                        {companyOrders.map((companyOrder) => (
                                           pieces.map((piece) => (
                                                <option key={piece.id} value={piece.id}>{piece.name}</option>
                                            ))
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={piece.quantity}
                                        onChange={(e) => {
                                            const updatedPieces = [...addData.company_orders_pieces];
                                            updatedPieces[index].quantity = Number(e.target.value);
                                            setAddData({...addData, company_orders_pieces: updatedPieces});
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 w-20"
                                    />
                                    <input
                                        type="number"
                                        value={piece.price}
                                        onChange={(e) => {
                                            const updatedPieces = [...addData.company_orders_pieces];
                                            updatedPieces[index].price = Number(e.target.value);
                                            setAddData({...addData, company_orders_pieces: updatedPieces});
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 w-20"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddPiece}
                                className="border border-solid border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 bg-white"
                            >
                                Ajouter une pièce
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeAddModal}
                                    className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler
                            </button>
                            <button type="submit"
                                    className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Update Modal */}
            <Modal isOpen={isUpdateModalOpen} onRequestClose={closeUpdateModal} ariaHideApp={false}
                   className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Modifier la commande entreprise</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(updateData.id);
                    }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={updateData.date}
                                   onChange={(e) => setUpdateData({...updateData, date: e.target.value})} required
                                   className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date de livraison estimée</label>
                            <input type="date" value={updateData.delivery_date}
                                   onChange={(e) => setUpdateData({...updateData, delivery_date: e.target.value})}
                                   className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date de livraison</label>
                            <input type="date" value={updateData.real_delivery_date}
                                   onChange={(e) => setUpdateData({...updateData, real_delivery_date: e.target.value})}
                                   className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring focus:border-blue-300"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                            <select value={updateData.supplier_id}
                                    onChange={(e) => setUpdateData({...updateData, supplier_id: e.target.value})}
                                    required
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Sélectionner un fournisseur</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pièces</label>
                            {updateData.company_orders_pieces.map((piece, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <select
                                        value={piece.piece_id}
                                        onChange={(e) => {
                                            const updatedPieces = [...updateData.company_orders_pieces];
                                            updatedPieces[index].piece_id = e.target.value;
                                            setUpdateData({...updateData, company_orders_pieces: updatedPieces});
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 mr-2"
                                    >
                                        <option value="">Sélectionner une pièce</option>
                                        {companyOrders.map((companyOrder) => (
                                            companyOrder.pieces.map((piece) => (
                                                <option key={piece.piece_id}
                                                        value={piece.piece_id}>{piece.piece.name}</option>
                                            ))
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={piece.quantity}
                                        onChange={(e) => {
                                            const updatedPieces = [...updateData.company_orders_pieces];
                                            updatedPieces[index].quantity = Number(e.target.value);
                                            setUpdateData({...updateData, company_orders_pieces: updatedPieces});
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 w-20"
                                    />
                                    <input
                                        type="number"
                                        value={piece.price}
                                        onChange={(e) => {
                                            const updatedPieces = [...updateData.company_orders_pieces];
                                            updatedPieces[index].price = Number(e.target.value);
                                            setUpdateData({...updateData, company_orders_pieces: updatedPieces});
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 w-20"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setUpdateData({
                                        ...updateData,
                                        company_orders_pieces: [...updateData.company_orders_pieces, {
                                            piece_id: '',
                                            price: 0,
                                            quantity: 1
                                        }]
                                    });
                                }}
                                className="border border-solid border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 bg-white"
                            >
                                Ajouter une pièce
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={closeUpdateModal}
                                    className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler
                            </button>
                            <button type="submit"
                                    className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Modifier
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>


            {/* Suppression modal */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} ariaHideApp={false}
                   className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Supprimer la commande entreprise</h2>
                    <p>Êtes-vous sûr de vouloir supprimer cette commande entreprise ? Cette action est irréversible.</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={closeDeleteModal} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                        <button onClick={handleDelete} className="border border-solid border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Supprimer</button>
                    </div>
                </div>
            </Modal>

            {/* Excel modal */}
            <Modal isOpen={isDownloadModalOpen} onRequestClose={closeDownloadModal} ariaHideApp={false}
                   className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Sélectionner le mois et l'année</h2>
                    {/*<div className="mb-4">*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>*/}
                    {/*    <input*/}
                    {/*        type="month"*/}
                    {/*        value={date}*/}
                    {/*        onChange={(e) => setDate(e.target.value)}*/}
                    {/*        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Année</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        {months.map((month, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={month}
                                    checked={selectedMonths.includes(month)}
                                    onChange={handleMonthChange}
                                    className="form-checkbox h-6 w-6"
                                />
                                <span>{month}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleDownload}
                            className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white"
                        >
                            Télécharger CSV
                        </button>
                        <button
                            onClick={closeDownloadModal}
                            className="border border-solid border-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-100 bg-white"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={supplierModalOpen} onRequestClose={closeSupplierModal} ariaHideApp={false} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 max-w-screen-lg overflow-x-auto max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Ajouter un fournisseur</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateSupplier(); }}>
                        <div className="overflow-x-auto">
                            <div className="mb-4 ml-1">
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    required
                                    onChange={(e) => setSupplierData({...supplierData, name: e.target.value})}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={closeSupplierModal} className="mr-2 border border-solid border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Annuler</button>
                            <button type="submit" className="border border-solid border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 bg-white">Ajouter un fournisseur</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <ToastContainer/>
        </AuthenticatedLayout>
    );
}

export default CompanyOrders;
