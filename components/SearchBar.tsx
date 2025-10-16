import React, { useState } from 'react';
import { ITEM_TYPES, ERAS, REGIONS } from '../constants';
import { FilterCriteria } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
    onSearch: (filters: FilterCriteria) => void;
    onRequestAddition: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onRequestAddition }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState('');
    const [era, setEra] = useState('');
    const [region, setRegion] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            searchTerm: searchTerm.trim() || undefined,
            type: type || undefined,
            era: era || undefined,
            region: region || undefined
        });
    };
    
    const baseSelectClasses = "w-full bg-white border border-stone-300 rounded-md shadow-sm py-2 px-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition duration-150 ease-in-out";

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    {/* Search Term Input */}
                    <div className="lg:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-stone-600 mb-1">
                            Find Artifacts, Museums, or Sites
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., 'Roman vase' or 'Giza'"
                            className="w-full bg-white border border-stone-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition duration-150"
                        />
                    </div>
                    {/* Filters */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-stone-600 mb-1">Type</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={baseSelectClasses}>
                            <option value="">All Types</option>
                            {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="era" className="block text-sm font-medium text-stone-600 mb-1">Era</label>
                        <select id="era" value={era} onChange={(e) => setEra(e.target.value)} className={baseSelectClasses}>
                            <option value="">All Eras</option>
                            {ERAS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="region" className="block text-sm font-medium text-stone-600 mb-1">Region</label>
                        <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className={baseSelectClasses}>
                            <option value="">All Regions</option>
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    {/* Submit Button */}
                    <div className="lg:col-start-4">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center bg-amber-800 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition duration-200"
                        >
                           <SearchIcon className="h-5 w-5 mr-2"/>
                            Search
                        </button>
                    </div>
                </div>
            </form>
             <div className="text-center mt-4">
                <span 
                    onClick={onRequestAddition} 
                    className="text-amber-800 hover:text-amber-900 font-semibold cursor-pointer transition-colors duration-200"
                >
                    &rarr; Request an Addition/Edit.
                </span>
            </div>
        </div>
    );
};

export default SearchBar;