import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {PageProps } from '@/types';
import {useState} from "react";

type Worker = {
    name: string;
    qualifications: string[];
};

type Manager = {
    name: string;
    responsibilities: string[];
};

const workers: Worker[] = [
    { name: 'Jean Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Peindre'] },
    { name: 'Pierre Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Vernir'] },
    { name: 'Jean Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Peindre'] },
    { name: 'Pierre Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Vernir'] },
    { name: 'Jean Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Peindre'] },
    { name: 'Pierre Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Vernir'] },
    { name: 'Jean Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Peindre'] },
    { name: 'Pierre Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Vernir'] },
    { name: 'Jean Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Peindre'] },
    { name: 'Pierre Dupont', qualifications: ['Couper du bois', 'Scier', 'Poncer', 'Vernir'] },
];

const managers: Manager[] = [
    { name: 'Marie Dupont', responsibilities: ['Création d\'un filet', 'Création d\'une planche de ping pong', 'Création d\'un banc', 'Création d\'une table'] },
    { name: 'Sophie Dupont', responsibilities: ['Création d\'un meuble TV', 'Création d\'un bureau', 'Création d\'une étagère', 'Création d\'un lit'] },
    { name: 'Marie Dupont', responsibilities: ['Création d\'un filet', 'Création d\'une planche de ping pong', 'Création d\'un banc', 'Création d\'une table'] },
    { name: 'Sophie Dupont', responsibilities: ['Création d\'un meuble TV', 'Création d\'un bureau', 'Création d\'une étagère', 'Création d\'un lit'] },
    { name: 'Marie Dupont', responsibilities: ['Création d\'un filet', 'Création d\'une planche de ping pong', 'Création d\'un banc', 'Création d\'une table'] },
    { name: 'Sophie Dupont', responsibilities: ['Création d\'un meuble TV', 'Création d\'un bureau', 'Création d\'une étagère', 'Création d\'un lit'] },
    { name: 'Marie Dupont', responsibilities: ['Création d\'un filet', 'Création d\'une planche de ping pong', 'Création d\'un banc', 'Création d\'une table'] },
    { name: 'Sophie Dupont', responsibilities: ['Création d\'un meuble TV', 'Création d\'un bureau', 'Création d\'une étagère', 'Création d\'un lit'] },
    { name: 'Marie Dupont', responsibilities: ['Création d\'un filet', 'Création d\'une planche de ping pong', 'Création d\'un banc', 'Création d\'une table'] },
    { name: 'Sophie Dupont', responsibilities: ['Création d\'un meuble TV', 'Création d\'un bureau', 'Création d\'une étagère', 'Création d\'un lit'] },
];

export default function Pieces({ auth }:PageProps) {
    const [employeeType, setEmployeeType] = useState<'worker' | 'manager'>('worker');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Nombre d'éléments par page

    const handleTypeChange = (type: 'worker' | 'manager') => {
        setEmployeeType(type);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentEmployees = employeeType === 'worker' ? workers : managers;
    const currentItems = currentEmployees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(currentEmployees.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Employés</h2>}
        >
            <Head title="Employés" />
            <div className="py-12">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <select
                                className="w-[180px] border border-gray-300 rounded-md px-4 py-2"
                                value={employeeType}
                                onChange={(e) => handleTypeChange(e.target.value as 'worker' | 'manager')}
                            >
                                <option value="worker">Ouvrier</option>
                                <option value="manager">Responsable</option>
                            </select>
                            <input className="max-w-xs border border-gray-300 rounded-md px-4 py-2" placeholder="Rechercher..." type="search" />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentItems.map((employee, index) => (
                            <div key={index} className="bg-white shadow-md rounded-md p-4 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold">{employee.name}</h2>
                                    <p className="text-sm">{employeeType === 'worker' ? 'Ouvrier' : 'Responsable'}</p>
                                </div>
                                <div className="grid gap-2">
                                    {employeeType === 'worker' && 'qualifications' in employee ? (
                                        employee.qualifications.map((qualification, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span>{qualification}</span>
                                            </div>
                                        ))
                                    ) : (
                                        employeeType === 'manager' && 'responsibilities' in employee ? (
                                            employee.responsibilities.map((responsibility, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span>{responsibility}</span>
                                                </div>
                                            ))
                                        ) : null
                                    )}
                                </div>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
