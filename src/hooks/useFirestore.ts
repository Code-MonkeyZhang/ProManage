import { useReducer, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { projectFirestore, timestamp } from "../firebase/config";
import { FirestoreState, FirestoreAction, UseFirestoreReturn } from "../types";
import { COLLECTIONS } from "../constants/firebase";

let initialState: FirestoreState = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

const firestoreReducer = (
  state: FirestoreState,
  action: FirestoreAction
): FirestoreState => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (
  collectionName: keyof typeof COLLECTIONS
): UseFirestoreReturn => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  // collection ref
  const ref = collection(projectFirestore, COLLECTIONS[collectionName]);

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action: FirestoreAction) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (docData: any): Promise<void> => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await addDoc(ref, { ...docData, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (error: any) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };

  // delete a document
  const deleteDocument = async (id: string): Promise<void> => {
    dispatch({ type: "IS_PENDING" });

    try {
      await deleteDoc(doc(projectFirestore, COLLECTIONS[collectionName], id));
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err: any) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  const updateDocument = async (id: string, updates: any): Promise<any> => {
    dispatch({ type: "IS_PENDING" });
    try {
      const updatedDocument = await updateDoc(
        doc(projectFirestore, COLLECTIONS[collectionName], id),
        updates
      );
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (err: any) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return null;
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
