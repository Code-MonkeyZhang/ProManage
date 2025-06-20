import React, { useEffect, useState, FormEvent } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
import { PROJECT_CATEGORIES } from "../../constants/firebase";

// Style
import "./Create.css";
import { useCollection } from "../../hooks/useCollection";

interface CategoryOption {
  value: string;
  label: string;
}

interface UserOption {
  value: any;
  label: string;
}

const categories: CategoryOption[] = [
  { value: PROJECT_CATEGORIES.DEVELOPMENT, label: "Development" },
  { value: PROJECT_CATEGORIES.DESIGN, label: "Design" },
  { value: PROJECT_CATEGORIES.SALES, label: "Sales" },
  { value: PROJECT_CATEGORIES.MARKETING, label: "Marketing" },
];

export default function Create() {
  const navigate = useNavigate();
  const { addDocument, response } = useFirestore("PROJECTS");

  const { documents } = useCollection("USERS");
  const [users, setUsers] = useState<UserOption[]>([]);
  const { user } = useAuthContext();

  // form field values
  const [name, setName] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [category, setCategory] = useState<CategoryOption | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<UserOption[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (documents) {
      const options = documents.map((user: any) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // handle errors
    if (!category) {
      setFormError("Please select a project category");
      return;
    }

    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    const createdBy = {
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
      id: user?.uid || "",
    };

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });

    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList,
    };

    // console.log(project);
    // save project to fireStore
    await addDocument(project);

    // if success, redirect to dashboard page
    if (!response.error) {
      navigate("/");
    }
  };

  const handleCategoryChange = (option: SingleValue<CategoryOption>) => {
    setCategory(option);
  };

  const handleAssignedUsersChange = (option: MultiValue<UserOption>) => {
    setAssignedUsers(Array.from(option));
  };

  return (
    <div>
      <h2>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          <span>Project name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label htmlFor="">
          <span>Project detail:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>

        <label>
          <span>Set due date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>

        <label>
          <span>Project category:</span>
          <Select onChange={handleCategoryChange} options={categories} />
        </label>

        <label>
          <span>Assign to:</span>
          <Select
            onChange={handleAssignedUsersChange}
            options={users}
            isMulti
          />
        </label>
        <button className="btn">Add Project</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
