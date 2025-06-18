import { useEffect, useState } from "react";
import Select from "react-select";

// Style
import "./Create.css";
import { useCollection } from "../../hooks/useCollection";

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);

  // form field values
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // handle errors
    if (!category) {
      setFormError("Please select a project category");
      return;
    }

    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    console.log(name, details, dueDate, category, assignedUsers);
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
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>

        <label>
          <span>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
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
