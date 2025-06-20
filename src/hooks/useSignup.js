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

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
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
      await setDoc(doc(projectFirestore, "users", res.user.uid), {
        online: true,
        displayName: displayName,
        photoURL: imgUrl,
      });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
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
