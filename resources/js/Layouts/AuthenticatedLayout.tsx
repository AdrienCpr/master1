import { useState, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { User } from '@/types';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const renderNavLinks = () => {
        switch (user.role.name) {
            case 'atelier':
                return (
                    <>
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1>Atelier</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('pieces-atelier')} active={route().current('pieces-atelier')}>
                                    Pièces
                                </NavLink>
                                <NavLink href={route('employees-atelier')} active={route().current('employees-atelier')}>
                                    Employés
                                </NavLink>
                                <NavLink href={route('ranges-atelier')} active={route().current('ranges-atelier')}>
                                    Gammes
                                </NavLink>
                                <NavLink href={route('ranges-history-atelier')} active={route().current('ranges-history-atelier')}>
                                    Historique des gammes
                                </NavLink>
                            </div>
                        </div>
                    </>
                );
        case 'responsable':
            return (
                <>
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <h1>Atelier</h1>
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink href={route('pieces-atelier')} active={route().current('pieces-atelier')}>
                                Pièces
                            </NavLink>
                            <NavLink href={route('employees-atelier')} active={route().current('employees-atelier')}>
                                Employés
                            </NavLink>
                            <NavLink href={route('ranges-atelier')} active={route().current('ranges-atelier')}>
                                Gammes
                            </NavLink>
                            <NavLink href={route('ranges-history-atelier')} active={route().current('ranges-history-atelier')}>
                                Historique des gammes
                            </NavLink>
                            <NavLink href={route('operations-atelier')} active={route().current('operations-atelier')}>
                                Opérations
                            </NavLink>
                            <NavLink href={route('posts-atelier')} active={route().current('posts-atelier')}>
                                Postes
                            </NavLink>
                            <NavLink href={route('machines-atelier')} active={route().current('machines-atelier')}>
                                Machines
                            </NavLink>
                        </div>
                    </div>
                </>
            );
            case 'comptabilite':
                return (
                    <>
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1>Comptabilité</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('quotes-comptabilite')} active={route().current('quotes-comptabilite')}>
                                    Devis
                                </NavLink>
                                <NavLink href={route('orders-comptabilite')} active={route().current('orders-comptabilite')}>
                                    Factures
                                </NavLink>
                                <NavLink href={route('company-orders-comptabilite')} active={route().current('my-orders-comptabilite')}>
                                    Nos achats
                                </NavLink>
                            </div>
                        </div>
                    </>
                );
            case 'admin':
                return (
                    <>
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1>Admin</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('users-admin')} active={route().current('users-admin')}>
                                    Utilisateurs
                                </NavLink>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const renderResponsiveNavLinks = () => {
        switch (user.role.name) {
            case 'atelier':
                return (
                    <>
                        <ResponsiveNavLink href={route('pieces-atelier')} active={route().current('pieces-atelier')}>
                            Pièces
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('employees-atelier')} active={route().current('employees-atelier')}>
                            Employés
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('ranges-atelier')} active={route().current('ranges-atelier')}>
                            Gammes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('ranges-history-atelier')} active={route().current('pieces-history-atelier')}>
                            Historique des gammes
                        </ResponsiveNavLink>
                    </>
                );
            case 'responsable':
                return (
                    <>
                        <ResponsiveNavLink href={route('pieces-atelier')} active={route().current('pieces-atelier')}>
                            Pièces
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('employees-atelier')} active={route().current('employees-atelier')}>
                            Employés
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('ranges-atelier')} active={route().current('ranges-atelier')}>
                            Gammes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('ranges-history-atelier')} active={route().current('pieces-history-atelier')}>
                            Historique des gammes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('operations-atelier')} active={route().current('operations-atelier')}>
                            Opérations
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('posts-atelier')} active={route().current('posts-atelier')}>
                            Postes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('machines-atelier')} active={route().current('machines-atelier')}>
                            Machines
                        </ResponsiveNavLink>
                    </>
                );
            case 'comptabilite':
                return (
                    <>
                        <ResponsiveNavLink href={route('quotes-comptabilite')} active={route().current('quotes-comptabilite')}>
                            Devis
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('orders-comptabilite')} active={route().current('orders-comptabilite')}>
                            Factures
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('company-orders-comptabilite')} active={route().current('my-orders-comptabilite')}>
                            Nos achats
                        </ResponsiveNavLink>
                    </>
                );
            case 'admin':
                return (
                    <>
                        <ResponsiveNavLink href={route('users-admin')} active={route().current('users-admin')}>
                            Utilisateurs
                        </ResponsiveNavLink>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {renderNavLinks()}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {/*<Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>*/}
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Se déconnecter
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {renderResponsiveNavLinks()}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/*<ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>*/}
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Se déconnecter
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
