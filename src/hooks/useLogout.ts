import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { UseLogoutReturn } from "../types";

export const useLogout = (): UseLogoutReturn => {
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch, user } = useAuthContext();

  const logout = async (): Promise<void> => {
    setError(null);
    setIsPending(true);

    try {
      // set user as offline
      const { uid } = user!;
      await updateDoc(doc(projectFirestore, "users", uid), {
        online: false,
      });

      // sign the user out
      await signOut(projectAuth);

      // dispatch logout action
      dispatch({ type: "LOGOUT" });

      // update state
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

  return { logout, error, isPending };
};
