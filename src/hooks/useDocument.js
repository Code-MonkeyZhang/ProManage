/*
这个hooks是用来获取单个文档的数据的
*/

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

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
