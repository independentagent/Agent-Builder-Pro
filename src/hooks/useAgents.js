import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

export function useAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'agents'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setAgents(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createAgent = async (agentData) => {
    try {
      const docRef = await addDoc(collection(db, 'agents'), {
        ...agentData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft'
      });
      return docRef.id;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateAgent = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'agents', id), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteAgent = async (id) => {
    try {
      await deleteDoc(doc(db, 'agents', id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const publishAgent = async (id) => {
    try {
      await updateDoc(doc(db, 'agents', id), {
        status: 'published',
        publishedAt: new Date()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    publishAgent
  };
}
