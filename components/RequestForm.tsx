import React, { useState } from 'react';
import { addRequest } from '../services/firebaseService';
import { ItemType } from '../types';
import { ITEM_TYPES } from '../constants';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface RequestFormProps {
    onBack: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: ItemType.Artifact,
        location: '',
        description: '',
        imageUrl: '',
        userEmail: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const { name, type, location, description, imageUrl, userEmail } = formData;
            
            const requestData = {
                name,
                type,
                location,
                description,
                ...(imageUrl && { imageUrl }),
                ...(userEmail && { userEmail }),
            };
            
            await addRequest(requestData);
            setIsSubmitted(true);
        } catch (err) {
            console.error("Failed to submit request:", err);
            setError("There was an error submitting your request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h2>
                <p className="text-stone-600 mb-6">Your request has been submitted for review. Our team will look into it shortly.</p>
                <button
                    onClick={onBack}
                    className="bg-amber-800 text-white font-bold py-2 px-6 rounded-md hover:bg-amber-900 transition"
                >
                    Back to Search
                </button>
            </div>
        );
    }
    
    const baseInputClasses = "w-full bg-white border border-stone-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-800";

    return (
        <div className="max-w-2xl mx-auto">
             <button
                onClick={onBack}
                className="flex items-center text-amber-800 hover:text-amber-900 font-semibold mb-6 transition-colors"
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2"/>
                Back to Search
            </button>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-stone-800 mb-6">Request an Addition/Edit</h2>
                <p className="text-stone-600 mb-6">Found something missing or incorrect? Fill out the form below to suggest a new artifact, museum, or site for our collection. For edits, please ensure the name is the <b>same</b> as the artifact to be edited. </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-600 mb-1">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={baseInputClasses} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-stone-600 mb-1">Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className={baseInputClasses} required>
                                {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-stone-600 mb-1">Location (e.g., City, Country)</label>
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={baseInputClasses} required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-stone-600 mb-1">Description / Reason for Addition</label>
                        <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={baseInputClasses} required />
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-600 mb-1">Image URL (Optional)</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className={baseInputClasses} />
                    </div>

                    <div>
                        <label htmlFor="userEmail" className="block text-sm font-medium text-stone-600 mb-1">Your Email (Optional)</label>
                        <input type="email" name="userEmail" id="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="For follow-up questions" className={baseInputClasses} />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="submit" disabled={isLoading} className="w-full bg-amber-800 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-900 transition disabled:bg-stone-400">
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestForm;