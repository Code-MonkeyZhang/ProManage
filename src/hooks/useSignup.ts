import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { UseSignupReturn } from "../types";
import { COLLECTIONS, USER_FIELDS } from "../constants/firebase";

export const useSignup = (): UseSignupReturn => {
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    thumbnail: File
  ): Promise<void> => {
    // update status
    setError(null);
    setIsPending(true);

    try {
      // use email & password to sign up
      const res = await createUserWithEmailAndPassword(
        projectAuth,
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // upload user images
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`; // 设定上传到数据库的路径
      const imgRef = ref(projectStorage, uploadPath);
      const uploadResult = await uploadBytes(imgRef, thumbnail); // 上传图片
      const imgUrl = await getDownloadURL(uploadResult.ref); // 获取图片在firebase的URL

      // add display name to user
      await updateProfile(res.user, { displayName, photoURL: imgUrl });

      // create user document
      // the id is based on userID
      await setDoc(doc(projectFirestore, COLLECTIONS.USERS, res.user.uid), {
        [USER_FIELDS.ONLINE]: true,
        [USER_FIELDS.DISPLAY_NAME]: displayName,
        [USER_FIELDS.PHOTO_URL]: imgUrl,
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

  return { signup, error, isPending };
};
