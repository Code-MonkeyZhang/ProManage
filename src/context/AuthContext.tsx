import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { projectAuth } from "../firebase/config";
import { AuthState, AuthAction, AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload || null };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { user: action.payload || null, authIsReady: true };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(projectAuth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
