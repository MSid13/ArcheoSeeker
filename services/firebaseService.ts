
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    where,
    updateDoc,
    documentId,
    limit,
    startAfter,
    QueryDocumentSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import { ArchaeologicalItem, FilterCriteria, AdditionRequest } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// SECURE AUTHENTICATION
// It is critical to secure your Firestore database. After implementing Firebase Auth,
// update your Firestore rules to only allow authenticated users to write data.
// An admin user must be created in the Firebase Authentication console.
// Example rules:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read on locations
    match /locations/{locationId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    // Allow anyone to submit requests
    match /requests/{requestId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null; // Only admins can manage requests
    }
    // Lock down admin collection if it exists
    match /admin/{docId} {
        allow read, write: if false; // Should not be client-accessible
    }
  }
}
*/

export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
    return signOut(auth);
};

export const onAuthChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

const locationsCollection = collection(db, 'locations');
const requestsCollection = collection(db, 'requests');

export const getItems = async (
    filters: FilterCriteria, 
    limitNum: number, 
    startAfterDoc?: QueryDocumentSnapshot<unknown>
): Promise<{ items: ArchaeologicalItem[], lastDoc: QueryDocumentSnapshot<unknown> | null }> => {
    let q = query(locationsCollection);

    // For public view, only show items that are NOT disabled.
    // This requires items to have `isDisabled: false` to be visible.
    q = query(q, where('isDisabled', '==', false));

    if (filters.type) {
        q = query(q, where('type', '==', filters.type));
    }
    if (filters.era) {
        q = query(q, where('era', '==', filters.era));
    }
    if (filters.region) {
        q = query(q, where('region', '==', filters.region));
    }

    if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
    }
    q = query(q, limit(limitNum));

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ArchaeologicalItem));
    
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    if (filters.searchTerm) {
        const lowercasedTerm = filters.searchTerm.toLowerCase();
        items = items.filter(item => 
            item.name.toLowerCase().includes(lowercasedTerm) || 
            item.description.toLowerCase().includes(lowercasedTerm) ||
            item.location.toLowerCase().includes(lowercasedTerm)
        );
    }
    
    return { items, lastDoc };
};

export const getAllItems = async (): Promise<ArchaeologicalItem[]> => {
    const snapshot = await getDocs(locationsCollection);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ArchaeologicalItem));
};

export const addItem = async (itemData: Omit<ArchaeologicalItem, 'id'>) => {
    await addDoc(locationsCollection, itemData);
};

export const updateItem = async (itemId: string, itemData: Partial<Omit<ArchaeologicalItem, 'id'>>) => {
    const itemDoc = doc(db, 'locations', itemId);
    await updateDoc(itemDoc, itemData);
};

export const deleteItem = async (itemId: string) => {
    const itemDoc = doc(db, 'locations', itemId);
    await deleteDoc(itemDoc);
};

export const getMuseums = async (): Promise<ArchaeologicalItem[]> => {
    const q = query(locationsCollection, where('type', '==', 'Museum'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ArchaeologicalItem));
};

export const getArtifactsInMuseum = async (museumId: string): Promise<ArchaeologicalItem[]> => {
    const q = query(locationsCollection, where('type', '==', 'Artifact'), where('museumIds', 'array-contains', museumId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ArchaeologicalItem));
};

export const getItemsByIds = async (ids: string[]): Promise<ArchaeologicalItem[]> => {
    if (!ids || ids.length === 0) return [];
    const q = query(locationsCollection, where(documentId(), 'in', ids));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ArchaeologicalItem));
};

// --- Request Management Functions ---

export const addRequest = async (requestData: Omit<AdditionRequest, 'id' | 'status' | 'submittedAt'>) => {
    await addDoc(requestsCollection, {
        ...requestData,
        status: 'pending',
        submittedAt: serverTimestamp()
    });
};

export const getRequests = async (): Promise<AdditionRequest[]> => {
    const q = query(requestsCollection, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdditionRequest));
};

export const deleteRequest = async (requestId: string) => {
    const requestDoc = doc(db, 'requests', requestId);
    await deleteDoc(requestDoc);
};