import React from 'react';
import { ArchaeologicalItem } from '../types';

interface ItemCardProps {
    item: ArchaeologicalItem;
    onSelect: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out group"
            onClick={onSelect}
        >
            <div className="relative h-48 w-full bg-stone-200">
                {item.imageUrl ? (
                    <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <p className="text-stone-500 font-semibold">NO IMAGE PROVIDED</p>
                    </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-colors duration-300"></div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-stone-800 truncate">{item.name}</h3>
                <p className="text-sm text-stone-500">{item.type}</p>
                <p className="text-sm text-stone-600 mt-1">{item.location}</p>
            </div>
        </div>
    );
};

export default ItemCard;