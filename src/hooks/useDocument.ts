/*
这个hooks是用来获取单个文档的数据的
*/

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { projectFirestore } from "../firebase/config";
import { UseDocumentReturn } from "../types";
import { COLLECTIONS } from "../constants/firebase";

export const useDocument = (
  collectionName: (typeof COLLECTIONS)[keyof typeof COLLECTIONS],
  id: string
): UseDocumentReturn => {
  const [document, setDocument] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // realtime data for document
  useEffect(() => {
    const ref = doc(projectFirestore, collectionName, id);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        // check if snapshot has data
        if (snapshot.data()) {
          setDocument({
            ...snapshot.data(),
            id: snapshot.id,
          });
          setError(null);
        } else {
          setError("No such document exists");
        }
      },
      (err) => {
        console.log(err.message);
        setError("failed to get document");
      }
    );

    return () => unsubscribe();
  }, [collectionName, id]);

  return { document, error };
};
