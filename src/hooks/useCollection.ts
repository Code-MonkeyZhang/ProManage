/*
自定义 Hook：useCollection
用于从 Firestore 中获取某个集合的数据，并支持实时监听数据变化。
可选支持查询条件（query）和排序规则（orderBy），避免重复查询时造成无限循环。
通常用于需要根据条件过滤数据的场景，例如：只获取某个用户的任务列表等。
*/

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy as firestoreOrderBy,
  onSnapshot,
  WhereFilterOp,
  OrderByDirection,
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";
import { UseCollectionReturn } from "../types";
import { COLLECTIONS } from "../constants/firebase";

type QueryConstraint = [string, WhereFilterOp, any];
type OrderByConstraint = [string, OrderByDirection];

export const useCollection = (
  collectionName: (typeof COLLECTIONS)[keyof typeof COLLECTIONS],
  _query?: QueryConstraint,
  _orderBy?: OrderByConstraint
): UseCollectionReturn => {
  const [documents, setDocuments] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const queryConstraints = useRef(_query).current;
  const orderByConstraint = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(projectFirestore, collectionName);
    let q: any = ref;

    if (queryConstraints) {
      q = query(ref, where(...queryConstraints));
    }
    if (orderByConstraint) {
      const currentQuery = queryConstraints
        ? query(
            ref,
            where(...queryConstraints),
            firestoreOrderBy(...orderByConstraint)
          )
        : query(ref, firestoreOrderBy(...orderByConstraint));
      q = currentQuery;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: any) => {
        let results: any[] = [];
        snapshot.docs.forEach((doc: any) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error: any) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collectionName, queryConstraints, orderByConstraint]);

  return { documents, error };
};
