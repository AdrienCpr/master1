import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

type Post = {
    name: string;
};

type Piece = {
    name: string;
};

type Worker = {
    id: number;
    name: string;
    posts: Post[];
};

type Manager = {
    id: number;
    name: string;
    ranges: { piece: Piece }[];
};

interface EmployeesProps extends PageProps {
    workers: Worker[];
    managers: Manager[];
}

export default function Employees({ auth, workers, managers }: EmployeesProps) {
    const [employeeType, setEmployeeType] = useState<'worker' | 'manager'>('worker');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 3;

    const handleTypeChange = (type: 'worker' | 'manager') => {
        setEmployeeType(type);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredEmployees = (employeeType === 'worker' ? workers : managers).filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

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
                            <input
                                className="max-w-xs border border-gray-300 rounded-md px-4 py-2"
                                placeholder="Rechercher..."
                                type="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentItems.map((employee) => (
                            <div key={employee.id} className="bg-white shadow-md rounded-md p-4 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold">{employee.name}</h2>
                                    <p className="text-sm">{employeeType === 'worker' ? 'Ouvrier' : 'Responsable'}</p>
                                </div>
                                <div className="grid gap-2">
                                    {employeeType === 'worker' && 'posts' in employee ? (
                                        employee.posts.map((post, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span>{post.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        employeeType === 'manager' && 'ranges' in employee ? (
                                            employee.ranges.map((range, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span>{range.piece.name}</span>
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
