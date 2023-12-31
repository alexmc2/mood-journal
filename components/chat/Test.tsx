import { db } from '../../firebase/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import React from 'react';


function TestComponent() {
  const addDocument = async () => {
    try {
      const testCollection = collection(db, 'testCollection');
      const docRef = await addDoc(testCollection, {
        name: 'Test Name',
        age: 25,
      });
      console.log('Document written with ID:', docRef.id);
    } catch (error) {
      console.log('Error adding document:', error);
    }
  };

  const fetchDocument = async () => {
    try {
      const docRef = doc(db, 'testCollection', 'testDoc');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  };


    return (
        <div>
        <button onClick={addDocument}>Add Document</button>
        <button onClick={fetchDocument}>Fetch Document</button>
        </div>
    );
}

export default TestComponent;
