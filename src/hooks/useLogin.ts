import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { UseLoginReturn } from "../types";

export const useLogin = (): UseLoginReturn => {
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setIsPending(true);

    try {
      // login
      const res = await signInWithEmailAndPassword(
        projectAuth,
        email,
        password
      );

      // set user as online
      const { uid } = res.user;
      await updateDoc(doc(projectFirestore, "users", uid), {
        online: true,
      });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err: any) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, isPending, error };
};
