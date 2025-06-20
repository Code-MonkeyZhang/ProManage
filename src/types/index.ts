import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

// Auth related types
export interface AuthState {
  user: User | null;
  authIsReady: boolean;
}

export interface AuthAction {
  type: "LOGIN" | "LOGOUT" | "AUTH_IS_READY";
  payload?: User | null;
}

export interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

// Project related types
export interface ProjectUser {
  displayName: string;
  photoURL: string;
  id: string;
}

export interface ProjectComment {
  displayName: string;
  photoURL: string;
  content: string;
  createdAt: Timestamp;
  id: string;
}

export interface Project {
  id: string;
  name: string;
  details: string;
  dueDate: Timestamp;
  category: string;
  assignedUsersList: ProjectUser[];
  comments: ProjectComment[];
  createdBy: ProjectUser;
  createdAt: Timestamp;
}

// Firestore hook types
export interface FirestoreState {
  document: any;
  isPending: boolean;
  error: string | null;
  success: boolean;
}

export interface FirestoreAction {
  type:
    | "IS_PENDING"
    | "ADDED_DOCUMENT"
    | "DELETED_DOCUMENT"
    | "UPDATED_DOCUMENT"
    | "ERROR";
  payload?: any;
}

// Collection hook types
export interface CollectionState {
  documents: any[] | null;
  error: string | null;
}

export interface DocumentState {
  document: any | null;
  error: string | null;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  displayName: string;
  thumbnail: File | null;
}

export interface CreateProjectFormData {
  name: string;
  details: string;
  dueDate: string;
  category: string;
  assignedUsers: ProjectUser[];
}

// Component Props
export interface AvatarProps {
  src?: string;
}

export interface OnlineUsersProps {}

export interface ProjectListProps {
  projects: Project[];
}

export interface SidebarProps {}

export interface NavbarProps {}

export interface ProjectFilterProps {
  currentFilter: string;
  changeFilter: (filter: string) => void;
}

export interface ProjectSummaryProps {
  project: Project;
}

export interface ProjectCommentsProps {
  project: Project;
}

// Hook return types
export interface UseSignupReturn {
  signup: (
    email: string,
    password: string,
    displayName: string,
    thumbnail: File
  ) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export interface UseLogoutReturn {
  logout: () => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export interface UseFirestoreReturn {
  addDocument: (docData: any) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: any) => Promise<any>;
  response: FirestoreState;
}

export interface UseCollectionReturn {
  documents: any[] | null;
  error: string | null;
}

export interface UseDocumentReturn {
  document: any | null;
  error: string | null;
}

// Select option type
export interface SelectOption {
  value: string;
  label: string;
}
