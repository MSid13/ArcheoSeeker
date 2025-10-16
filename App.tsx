
import React, { useState, useEffect } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import DetailView from './components/DetailView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import RequestForm from './components/RequestForm';
import EducationPage from './components/EducationPage';
import { ArchaeologicalItem, FilterCriteria } from './types';
import { getItems, onAuthChanged, signIn, signOutUser } from './services/firebaseService';
import { resetLoginAttempts, canAttemptLogin, recordFailedLogin } from './services/loginAttemptService';

type ViewMode = 'list' | 'detail' | 'login' | 'admin' | 'request' | 'education';

const PAGE_SIZE = 9;

const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [items, setItems] = useState<ArchaeologicalItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ArchaeologicalItem | null>(null);
    const [filters, setFilters] = useState<FilterCriteria>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<unknown> | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [authInitialized, setAuthInitialized] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthChanged(user => {
            setIsAdmin(!!user);
            setAuthInitialized(true);
            if (!user) {
                // If user logs out, go back to list view
                if(viewMode === 'admin'){
                    setViewMode('list');
                }
            }
        });
        return () => unsubscribe(); // Cleanup subscription
    }, [viewMode]);

    useEffect(() => {
        const fetchInitialItems = async () => {
            setIsLoading(true);
            setError(null);
            setHasMore(true); // Reset on new search
            try {
                const { items: newItems, lastDoc } = await getItems(filters, PAGE_SIZE);
                setItems(newItems);
                setLastVisible(lastDoc);
                if (newItems.length < PAGE_SIZE || !lastDoc) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error("Error fetching items:", err);
                setError("Failed to fetch archaeological data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialItems();
    }, [filters]);

    const handleSearch = (newFilters: FilterCriteria) => {
        setFilters(newFilters);
        setViewMode('list');
    };
    
    const handleSeeMore = async () => {
        if (!lastVisible || !hasMore) return;

        setIsFetchingMore(true);
        setError(null);
        try {
            const { items: newItems, lastDoc } = await getItems(filters, PAGE_SIZE, lastVisible);
            setItems(prevItems => [...prevItems, ...newItems]);
            setLastVisible(lastDoc);
            if (newItems.length < PAGE_SIZE || !lastDoc) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error fetching more items:", err);
            setError("Failed to load more data.");
        } finally {
            setIsFetchingMore(false);
        }
    };


    const handleItemSelect = (item: ArchaeologicalItem) => {
        setSelectedItem(item);
        setViewMode('detail');
    };

    const handleBack = () => {
        setSelectedItem(null);
        setViewMode('list');
    };

    const handleAdminLoginRequest = () => {
        setViewMode('login');
    };
    
    const handleRequestAddition = () => {
        setViewMode('request');
    };

    const handleEducationLink = () => {
        setViewMode('education');
    };

    const handleLogin = async (email: string, password: string) => {
        if (!canAttemptLogin()) {
            return false;
        }
        try {
            await signIn(email, password);
            resetLoginAttempts();
            setViewMode('admin');
            return true;
        } catch (err) {
            console.error("Login failed:", err);
            recordFailedLogin();
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            await signOutUser();
            setIsAdmin(false);
            setFilters({}); // Reset filters on logout to refresh list
            setViewMode('list');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const renderContent = () => {
        if (!authInitialized) {
            return (
                <div className="text-center p-10">
                    <p className="text-xl text-stone-600">Initializing...</p>
                </div>
            );
        }
        switch (viewMode) {
            case 'detail':
                return selectedItem && <DetailView item={selectedItem} onBack={handleBack} onSelectItem={handleItemSelect} />;
            case 'login':
                return <AdminLogin onLogin={handleLogin} onBack={() => setViewMode('list')} />;
            case 'admin':
                return isAdmin ? <AdminDashboard onLogout={handleLogout} /> : <p>Access Denied. Please log in.</p>;
            case 'request':
                return <RequestForm onBack={() => setViewMode('list')} />;
            case 'education':
                return <EducationPage onBack={() => setViewMode('list')} />;
            case 'list':
            default:
                return (
                    <>
                        <div className="text-center mb-6">
                            <span
                                onClick={handleEducationLink}
                                className="text-amber-800 hover:text-amber-900 font-semibold cursor-pointer transition-colors duration-200 text-lg"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handleEducationLink()}
                            >
                                Archaeology Education Resources &rarr;
                            </span>
                        </div>
                        <SearchBar onSearch={handleSearch} onRequestAddition={handleRequestAddition} />
                        {isLoading ? (
                             <div className="text-center p-10">
                                <p className="text-xl text-stone-600">Loading treasures...</p>
                            </div>
                        ) : error && items.length === 0 ? (
                             <div className="text-center p-10 text-red-600">{error}</div>
                        ) : (
                            <>
                                <ResultsList items={items} onSelectItem={handleItemSelect} />
                                <div className="text-center mt-10">
                                    {hasMore && !isLoading && (
                                        <button
                                            onClick={handleSeeMore}
                                            disabled={isFetchingMore}
                                            className="bg-amber-800 text-white font-bold py-3 px-8 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition duration-200 disabled:bg-stone-400"
                                        >
                                            {isFetchingMore ? 'Loading...' : 'See More'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
            <Footer onAdminLogin={handleAdminLoginRequest} onRequestAddition={handleRequestAddition} />
        </div>
    );
};

export default App;
