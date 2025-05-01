import React from 'react';

const Footer = () => {

    return (
        <footer className="bg-white dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Copyright */}
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} Tokenfolio. All rights reserved.
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Cryptocurrency prices and data provided for informational purposes only.
                            Not financial advice.
                        </p>
                    </div>

                </div>

                {/* Attribution */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Powered by CoinGecko API
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;