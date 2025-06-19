/*
这个hooks是用来获取单个文档的数据的
*/

import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime data for document
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id);

    const unsubscribe = ref.onSnapshot(
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
  }, [collection, id]);

  return { document, error };
};
