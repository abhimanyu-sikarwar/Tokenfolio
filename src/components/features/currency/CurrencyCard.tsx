import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils/formatters';
import { Cryptocurrency, SupportedCurrency } from '@/types/currency';

interface CurrencyCardProps {
    crypto: Cryptocurrency;
    currency: SupportedCurrency;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({
    crypto,
    currency,
}) => {
    const {
        id,
        name,
        symbol,
        image,
        currentPrice,
        priceChangePercentage24h,
        marketCap,
        marketCapRank,
        circulatingSupply,
        maxSupply,
    } = crypto;

    const priceChangeColor =
        priceChangePercentage24h > 0
            ? 'text-green-600 dark:text-green-400'
            : priceChangePercentage24h < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400';

    return (
        <Link href={`/currency/${id}`} className="block w-full">
            <Card
                clickable
                hoverEffect="medium"
                padding="p-4"
                className="h-full"
                data-testid={`currency-card-${id}`}
            >
                <div className="flex items-start">
                    {/* Cryptocurrency icon and rank */}
                    <div className="relative flex-shrink-0 mr-4">
                        <div className="relative h-12 w-12">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={name}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-medium">{symbol.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium h-5 w-5 flex items-center justify-center border border-white dark:border-gray-800">
                            {marketCapRank || '?'}
                        </div>
                    </div>

                    {/* Cryptocurrency details */}
                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white truncate w-full max-w-[110px]">{name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{symbol}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(currentPrice, currency)}
                                </p>
                                <p className={`text-sm ${priceChangeColor}`}>
                                    {priceChangePercentage24h > 0 ? '+' : ''}
                                    {formatPercentage(priceChangePercentage24h / 100)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Market cap and Supply */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                        <span className="text-gray-900 dark:text-gray-100">
                            {formatCurrency(marketCap, currency, {
                                notation: 'compact',
                                maximumFractionDigits: 2
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                        <span className="text-gray-500 dark:text-gray-400">Supply</span>
                        <span className="text-gray-900 dark:text-gray-100">
                            {formatLargeNumber(circulatingSupply)}
                            {
                                maxSupply
                                    ? ` / ${formatLargeNumber(maxSupply)}`
                                    : ' / No Cap'
                            }
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default CurrencyCard;