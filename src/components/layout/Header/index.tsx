'use client';
import React from 'react';
import Link from 'next/link';
import { useCurrency } from '@/lib/hooks/useCurrency';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import SearchBar from '@/components/features/search/SearchBar';

const Header = () => {
    const { currency, setCurrency } = useCurrency();

    const currencyOptions: DropdownOption[] = [
        {
            value: 'USD',
            label: 'USD ($)',
            icon: <span className="text-lg">$</span>
        },
        {
            value: 'EUR',
            label: 'EUR (€)',
            icon: <span className="text-lg">€</span>
        },
        {
            value: 'GBP',
            label: 'GBP (£)',
            icon: <span className="text-lg">£</span>
        },
        {
            value: 'CHF',
            label: 'CHF (Fr)',
            icon: <span className="text-lg">Fr</span>
        },
        {
            value: 'INR',
            label: 'INR (₹)',
            icon: <span className="text-lg">₹</span>
        },
    ];

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between space-x-6">
                    {/* Logo and site name */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Tokenfolio
                            </span>
                        </Link>
                    </div>
                    <div className='flex-grow' >

                    <SearchBar />
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center ">
                        {/* Currency selector */}
                        <Dropdown
                            aria-label="Select display currency"
                            options={currencyOptions}
                            value={currency}
                            onChange={(value) => setCurrency(value as any)}
                            width="auto"
                            className="w-32"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;