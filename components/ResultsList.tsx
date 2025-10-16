
import React from 'react';
import { ArchaeologicalItem } from '../types';
import ItemCard from './ItemCard';

interface ResultsListProps {
    items: ArchaeologicalItem[];
    onSelectItem: (item: ArchaeologicalItem) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ items, onSelectItem }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <h2 className="text-2xl font-semibold text-stone-700">No Treasures Found</h2>
                <p className="text-stone-500 mt-2">Try adjusting your search filters to discover hidden histories.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => (
                <ItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
            ))}
        </div>
    );
};

export default ResultsList;
