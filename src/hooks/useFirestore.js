import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  const addDocument = async (document) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), document);
      return docRef.id;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateDocument = async (id, updates) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument
  };
}
