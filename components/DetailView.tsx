
import React, { useState, useEffect } from 'react';
import { ArchaeologicalItem, ItemType } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { getItemsByIds, getArtifactsInMuseum } from '../services/firebaseService';
import ItemCard from './ItemCard';

interface DetailViewProps {
    item: ArchaeologicalItem;
    onBack: () => void;
    onSelectItem: (item: ArchaeologicalItem) => void;
}

const formatDescription = (text: string) => {
    if (!text) return null;
    const parts = text.split('**');
    return (
        <>
            {parts.map((part, index) => 
                index % 2 === 1 
                ? <strong key={index}>{part}</strong> 
                : part
            )}
        </>
    );
};

const DetailView: React.FC<DetailViewProps> = ({ item, onBack, onSelectItem }) => {
    const [relatedItems, setRelatedItems] = useState<ArchaeologicalItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelatedItems = async () => {
            if (!item) return;

            setIsLoading(true);
            setError(null);
            try {
                let fetchedItems: ArchaeologicalItem[] = [];
                if (item.type === ItemType.Museum) {
                    fetchedItems = await getArtifactsInMuseum(item.id);
                } else if (item.type === ItemType.Artifact && item.museumIds && item.museumIds.length > 0) {
                    fetchedItems = await getItemsByIds(item.museumIds);
                }
                setRelatedItems(fetchedItems);
            } catch (err) {
                console.error("Error fetching related items:", err);
                setError("Could not load related items.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelatedItems();
    }, [item]);

    const getRelatedTitle = () => {
        if (item.type === ItemType.Museum) return "Artifacts in this Museum";
        if (item.type === ItemType.Artifact && relatedItems.length > 0) return "Displayed in Museum(s)";
        return null;
    };
    
    const relatedTitle = getRelatedTitle();

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-amber-800 hover:text-amber-900 font-semibold mb-6 transition-colors"
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                Back to Results
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                 <div className="w-full h-64 bg-stone-200 flex items-center justify-center">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <p className="text-stone-500 font-semibold text-lg">NO IMAGE PROVIDED</p>
                    )}
                </div>
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-stone-800 mb-2">{item.name}</h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-500 mb-6">
                        <span><strong>Type:</strong> {item.type}</span>
                        <span><strong>Era:</strong> {item.era}</span>
                        <span><strong>Region:</strong> {item.region}</span>
                    </div>

                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{formatDescription(item.description)}</p>
                    
                    <div className="mt-6 pt-6 border-t border-stone-200">
                         <h3 className="text-lg font-semibold text-stone-700">Location</h3>
                         <p className="text-stone-600">{item.location}</p>
                    </div>

                    {relatedItems.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-stone-200">
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">{relatedTitle}</h2>
                            {isLoading ? (
                                <p>Loading related items...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <ul className="space-y-3">
                                    {relatedItems.map(relatedItem => (
                                        <li key={relatedItem.id}>
                                            <button
                                                onClick={() => onSelectItem(relatedItem)}
                                                className="w-full text-left p-3 bg-stone-100 rounded-md hover:bg-amber-100 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-700"
                                            >
                                                <p className="font-semibold text-stone-800">{relatedItem.name}</p>
                                                <p className="text-sm text-stone-600">{relatedItem.location}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailView;
