
import React, { useState, useEffect, useCallback } from 'react';
import { ArchaeologicalItem, AdditionRequest } from '../types';
import { getAllItems, deleteItem, getRequests, deleteRequest, updateItem } from '../services/firebaseService';
import { ItemForm } from './AddItemForm';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import ToggleSwitch from './ToggleSwitch';

interface AdminDashboardProps {
    onLogout: () => void;
}

type AdminView = 'list' | 'form';
type AdminTab = 'items' | 'requests';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [items, setItems] = useState<ArchaeologicalItem[]>([]);
    const [requests, setRequests] = useState<AdditionRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<AdminView>('list');
    const [currentTab, setCurrentTab] = useState<AdminTab>('items');
    const [itemToEdit, setItemToEdit] = useState<ArchaeologicalItem | undefined>(undefined);
    const [requestToApprove, setRequestToApprove] = useState<AdditionRequest | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    const [denyingRequestId, setDenyingRequestId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (currentTab === 'items') {
                const allItems = await getAllItems();
                
                // One-time data migration: Find items without the 'isDisabled' field
                // and set them to visible by default. This ensures older items appear correctly.
                const itemsToUpdate = allItems.filter(item => typeof item.isDisabled === 'undefined');

                if (itemsToUpdate.length > 0) {
                    console.log(`Found ${itemsToUpdate.length} items missing 'isDisabled' field. Updating to visible.`);
                    const updatePromises = itemsToUpdate.map(item => 
                        updateItem(item.id, { isDisabled: false })
                    );
                    await Promise.all(updatePromises);
                    
                    // After updating, refetch the complete list to ensure UI consistency.
                    const updatedItems = await getAllItems();
                    setItems(updatedItems);
                } else {
                    // If no migration is needed, just set the items.
                    setItems(allItems);
                }
            } else {
                const allRequests = await getRequests();
                setRequests(allRequests);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data for the dashboard.");
        } finally {
            setIsLoading(false);
        }
    }, [currentTab]);

    useEffect(() => {
        if (view === 'list') {
            fetchData();
        }
    }, [view, fetchData]);
    
    // Edit an existing item
    const handleEditItem = (item: ArchaeologicalItem) => {
        setItemToEdit(item);
        setRequestToApprove(undefined);
        setView('form');
    };

    // Add a new item from scratch
    const handleAddNewItem = () => {
        setItemToEdit(undefined);
        setRequestToApprove(undefined);
        setView('form');
    };
    
    // Approve a user request
    const handleApproveRequest = (request: AdditionRequest) => {
        setRequestToApprove(request);
        setItemToEdit(undefined);
        setView('form');
    };

    const handleDeleteItem = async (itemId: string) => {
        if (deletingItemId) return; // Prevent multiple clicks

        if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            setDeletingItemId(itemId);
            setError(null);
            try {
                await deleteItem(itemId);
                setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            } catch (err) {
                console.error("Failed to delete item:", err);
                setError("Could not delete the item. Please try again.");
            } finally {
                setDeletingItemId(null);
            }
        }
    };
    
    const handleDenyRequest = async (requestId: string) => {
        if (denyingRequestId) return; // Prevent multiple clicks

        if (window.confirm("Are you sure you want to deny this request? This will permanently delete it.")) {
            setDenyingRequestId(requestId);
            setError(null);
            try {
                await deleteRequest(requestId);
                setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
            } catch (err) {
                 console.error("Failed to deny request:", err);
                setError("Could not deny the request. Please try again.");
            } finally {
                setDenyingRequestId(null);
            }
        }
    };
    
    const handleToggleVisibility = async (item: ArchaeologicalItem) => {
        const newDisabledState = !(item.isDisabled ?? false);
        try {
            await updateItem(item.id, { isDisabled: newDisabledState });
            setItems(prevItems =>
                prevItems.map(i =>
                    i.id === item.id ? { ...i, isDisabled: newDisabledState } : i
                )
            );
        } catch (err) {
            console.error("Failed to update item visibility:", err);
            setError("Could not update item visibility. Please try again.");
        }
    };

    const handleItemSaved = async (approvedRequestId?: string) => {
        setView('list');
        setItemToEdit(undefined);
        setRequestToApprove(undefined);
        if (approvedRequestId) {
            await deleteRequest(approvedRequestId);
            setCurrentTab('requests'); // Go back to requests tab after approval
        } else {
             setCurrentTab('items');
        }
        // Data will be refetched by the useEffect hook when view changes to 'list'
    };
    
    const handleCancelForm = () => {
        setView('list');
        setItemToEdit(undefined);
        setRequestToApprove(undefined);
    };

    if (view === 'form') {
        return (
            <div className="max-w-4xl mx-auto">
                <ItemForm 
                    onItemSaved={handleItemSaved} 
                    onCancel={handleCancelForm} 
                    itemToEdit={itemToEdit}
                    requestToApprove={requestToApprove} 
                />
            </div>
        );
    }
    
    const tabClasses = (tabName: AdminTab) => 
        `px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
            currentTab === tabName 
            ? 'border-b-2 border-amber-800 text-amber-800' 
            : 'text-stone-500 hover:text-stone-700'
        }`;

    const renderRequestsTable = () => (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
                 <thead className="bg-stone-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-200">
                    {requests.length > 0 ? requests.map((request) => (
                        <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{request.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{request.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{request.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => handleApproveRequest(request)} className="inline-flex items-center text-green-600 hover:text-green-900 font-semibold">
                                    <CheckIcon className="h-5 w-5 mr-1" />
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleDenyRequest(request.id)} 
                                    disabled={!!denyingRequestId}
                                    className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {denyingRequestId === request.id ? (
                                        <svg className="animate-spin h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <XIcon className="h-5 w-5 mr-1" />
                                    )}
                                    Deny
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-10 px-4">
                                <p className="text-stone-500">No pending requests.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
    
     const renderItemsTable = () => (
         <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
                 <thead className="bg-stone-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Visible</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-200">
                    {items.length > 0 ? items.map((item) => (
                        <tr key={item.id} className={`transition-opacity duration-300 ${item.isDisabled ? 'opacity-50 bg-stone-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{item.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{item.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                                <ToggleSwitch
                                    enabled={!(item.isDisabled ?? false)}
                                    onChange={() => handleToggleVisibility(item)}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center justify-end space-x-4">
                                    <button onClick={() => handleEditItem(item)} className="text-amber-600 hover:text-amber-900 font-semibold">Edit</button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        disabled={!!deletingItemId}
                                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={`Delete ${item.name}`}
                                    >
                                        {deletingItemId === item.id ? (
                                             <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <TrashIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                         <tr>
                            <td colSpan={5} className="text-center py-10 px-4">
                                <p className="text-stone-500">No items found. Click 'Add New Item' to get started.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
                <div>
                     <button
                        onClick={onLogout}
                        className="bg-stone-500 text-white font-bold py-2 px-4 rounded-md hover:bg-stone-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
            
            <div className="mb-6 border-b border-stone-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button className={tabClasses('items')} onClick={() => setCurrentTab('items')}>
                        Manage Items
                    </button>
                    <button className={tabClasses('requests')} onClick={() => setCurrentTab('requests')}>
                        Manage Requests 
                        {requests.length > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{requests.length}</span>}
                    </button>
                </nav>
            </div>

            {currentTab === 'items' && (
                <div className="flex justify-end mb-4">
                     <button
                        onClick={handleAddNewItem}
                        className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition"
                    >
                        <PlusIcon className="h-5 w-5 mr-2"/>
                        Add New Item
                    </button>
                </div>
            )}

            {isLoading && <div className="text-center p-10"><p className="text-xl text-stone-600">Loading...</p></div>}
            {error && <div className="text-center p-10 text-red-600">{error}</div>}

            {!isLoading && !error && (
                currentTab === 'items' ? renderItemsTable() : renderRequestsTable()
            )}
        </div>
    );
};

export default AdminDashboard;
