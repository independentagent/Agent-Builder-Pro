import { useEffect, useState } from 'react';
import { db, auth, analytics } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function FirebaseTest() {
  const [firestoreStatus, setFirestoreStatus] = useState('Testing...');
  const [authStatus, setAuthStatus] = useState('Testing...');
  const [analyticsStatus, setAnalyticsStatus] = useState('Testing...');

  useEffect(() => {
    // Test Firestore connection
    const testFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        setFirestoreStatus('Connected ✅');
      } catch (error) {
        setFirestoreStatus(`Error: ${error.message}`);
      }
    };

    // Test Authentication connection
    const testAuth = () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setAuthStatus('Connected ✅');
          unsubscribe();
        });
      } catch (error) {
        setAuthStatus(`Error: ${error.message}`);
      }
    };

    // Test Analytics connection
    const testAnalytics = () => {
      try {
        if (analytics.app) {
          setAnalyticsStatus('Connected ✅');
        } else {
          setAnalyticsStatus('Error: Analytics not initialized');
        }
      } catch (error) {
        setAnalyticsStatus(`Error: ${error.message}`);
      }
    };

    testFirestore();
    testAuth();
    testAnalytics();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-4">Firebase Connection Test</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Firestore:</span> {firestoreStatus}
        </div>
        <div>
          <span className="font-medium">Authentication:</span> {authStatus}
        </div>
        <div>
          <span className="font-medium">Analytics:</span> {analyticsStatus}
        </div>
      </div>
    </div>
  );
}
