import React, { useState, useEffect } from 'react';
import { ArchaeologicalItem, ItemType, AdditionRequest } from '../types';
import { ITEM_TYPES, ERAS, REGIONS } from '../constants';
import { addItem, updateItem, getMuseums } from '../services/firebaseService';

interface ItemFormProps {
    itemToEdit?: ArchaeologicalItem;
    requestToApprove?: AdditionRequest;
    onItemSaved: (approvedRequestId?: string) => void;
    onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ itemToEdit, requestToApprove, onItemSaved, onCancel }) => {
    const [formData, setFormData] = useState<Omit<ArchaeologicalItem, 'id'>>({
        name: '',
        description: '',
        type: ItemType.Artifact,
        era: ERAS[0],
        region: REGIONS[0],
        location: '',
        imageUrl: '',
        museumIds: [],
        isDisabled: false,
    });
    const [museums, setMuseums] = useState<ArchaeologicalItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = Boolean(itemToEdit);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name || '',
                description: itemToEdit.description || '',
                type: itemToEdit.type || ItemType.Artifact,
                era: itemToEdit.era || '',
                region: itemToEdit.region || '',
                location: itemToEdit.location || '',
                imageUrl: itemToEdit.imageUrl || '',
                museumIds: itemToEdit.museumIds || [],
                isDisabled: itemToEdit.isDisabled ?? false,
            });
        } else if (requestToApprove) {
             setFormData({
                name: requestToApprove.name || '',
                description: requestToApprove.description || '',
                type: requestToApprove.type || ItemType.Artifact,
                era: '', // Admin needs to fill this
                region: '', // Admin needs to fill this
                location: requestToApprove.location || '',
                imageUrl: requestToApprove.imageUrl || '',
                museumIds: [],
                isDisabled: false,
            });
        }
    }, [itemToEdit, requestToApprove]);

    useEffect(() => {
        const fetchMuseums = async () => {
            try {
                const museumList = await getMuseums();
                setMuseums(museumList);
            } catch (err) {
                console.error("Failed to fetch museums", err);
                setError("Could not load list of museums.");
            }
        };

        if (formData.type === ItemType.Artifact) {
            fetchMuseums();
        }
    }, [formData.type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMuseumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Fix: Explicitly type `option` as `HTMLOptionElement` to resolve TypeScript error.
        const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData(prev => ({ ...prev, museumIds: selectedIds }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            if (isEditMode && itemToEdit) {
                await updateItem(itemToEdit.id, formData);
                onItemSaved();
            } else {
                await addItem(formData);
                onItemSaved(requestToApprove?.id);
            }
        } catch (err) {
            console.error(err);
            const action = isEditMode ? 'update' : (requestToApprove ? 'approve' : 'add');
            setError(`Failed to ${action} item. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const baseInputClasses = "w-full bg-white border border-stone-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-800";
    
    const getTitle = () => {
        if (isEditMode) return 'Edit Item';
        if (requestToApprove) return 'Approve & Add Item';
        return 'Add New Item';
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">{getTitle()}</h2>
            {requestToApprove && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                    <p className="font-semibold text-amber-800">Reviewing User Request</p>
                    <p className="text-sm text-amber-700">Please review the details below, fill in any missing fields (like Era and Region), and save to add it to the collection.</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-600 mb-1">Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={baseInputClasses} required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                    <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={baseInputClasses} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-stone-600 mb-1">Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleChange} className={baseInputClasses} required>
                            {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="era" className="block text-sm font-medium text-stone-600 mb-1">Era</label>
                        <select name="era" id="era" value={formData.era} onChange={handleChange} className={baseInputClasses} required>
                            <option value="">Select Era</option>
                            {ERAS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="region" className="block text-sm font-medium text-stone-600 mb-1">Region</label>
                        <select name="region" id="region" value={formData.region} onChange={handleChange} className={baseInputClasses} required>
                            <option value="">Select Region</option>
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium text-stone-600 mb-1">Location (e.g., City, Country)</label>
                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={baseInputClasses} required />
                    </div>
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-600 mb-1">Image URL</label>
                    <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className={baseInputClasses} />
                </div>

                {formData.type === ItemType.Artifact && (
                    <div>
                        <label htmlFor="museumIds" className="block text-sm font-medium text-stone-600 mb-1">Museum(s)</label>
                        <select
                            name="museumIds"
                            id="museumIds"
                            multiple
                            value={formData.museumIds}
                            onChange={handleMuseumChange}
                            className={`${baseInputClasses} h-32`}
                        >
                            {museums.map(museum => (
                                <option key={museum.id} value={museum.id}>{museum.name}</option>
                            ))}
                        </select>
                         <p className="text-xs text-stone-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
                    </div>
                )}
                
                {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-stone-200 text-stone-800 font-bold py-2 px-4 rounded-md hover:bg-stone-300 transition">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="bg-amber-800 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-900 transition disabled:bg-stone-400">
                        {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save Item')}
                    </button>
                </div>
            </form>
        </div>
    );
};