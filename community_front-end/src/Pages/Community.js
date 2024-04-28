import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Community = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the community ID from the URL
  const [community, setCommunity] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateFields, setNewTemplateFields] = useState([]);
  const [fieldToAdd, setFieldToAdd] = useState({ name: "", type: "" });
  const [fieldTypes] = useState(["Text", "Number", "Date", "Boolean"]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch community data using the ID
    const token = localStorage.getItem("token");
    const fetchCommunity = async () => {
      //   console.log(token)
      try {
        const response = await axios.get(
          `http://localhost:8000/api/community/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("Response :", response.data);
        setCommunity(response.data);
      } catch (error) {
        console.error("Error fetching community data:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchCommunity(); // Call the fetch function on component mount
    // Fetch templates for the community
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/community/${id}/templates/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchTemplates(); // Call the fetch function on component mount
  }, [id]);

  const handleHomePage = () => {
    navigate("/home");
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  if (!community) {
    return <div>Loading...</div>; // Placeholder for loading state
  }
  const handleAddField = () => {
    if (fieldToAdd.name === "" || fieldToAdd.type === "") return;
    setNewTemplateFields([...newTemplateFields, fieldToAdd]);
    setFieldToAdd("");
  };
  const handleCreateTemplate = async () => {
    if (newTemplateName === "") return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/community/${id}/templates/`,
        {
          name: newTemplateName,
          settings: JSON.stringify(newTemplateFields),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json", // Add content type header
          },
        }
      );
      setTemplates([...templates, response.data]);
      setNewTemplateName("");
      setNewTemplateFields([]);
    } catch (error) {
      console.error("Error creating template:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3">
        <div>
          <span className="fw-bold">LOGO</span> {/* Replace with your logo */}
        </div>
        <div>
          <h1 className="text-center fw-bold">COMMUNITY PLATFORM</h1>
        </div>
        <div>
          <button className="btn" onClick={handleHomePage}>
            Home
          </button>
          <button className="btn btn-danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>
      {/* Community details */}
      <div className="container">
        <h1>{community.name}</h1>
        <p>Description: {community.description}</p>
        <p>Owner: {community.owner.username}</p>
        <p>
          Managers:{" "}
          {community.managers.map((manager) => manager.username).join(", ")}
        </p>
        {/* Additional community details can be displayed here */}
      </div>
      {/* Templates section */}
      <h1>Community Templates</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Create New Template
      </button>
      {/* Modal for creating a new template */}
      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Template</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="templateName" className="form-label">
                      Template Name
                    </label>
                    <input
                      type="text"
                      id="templateName"
                      className="form-control"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fieldName" className="form-label">
                      Field Name
                    </label>
                    <input
                      type="text"
                      id="fieldName"
                      className="form-control"
                      value={fieldToAdd.name}
                      onChange={(e) =>
                        setFieldToAdd({ ...fieldToAdd, name: e.target.value })
                      }
                      placeholder="Enter field name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fieldType" className="form-label">
                      Field Type
                    </label>
                    <select
                      id="fieldType"
                      className="form-select"
                      value={fieldToAdd.type}
                      onChange={(e) =>
                        setFieldToAdd({ ...fieldToAdd, type: e.target.value })
                      }
                    >
                      <option value="">Select field type</option>
                      {fieldTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={handleAddField}
                  >
                    Add Field
                  </button>
                  <div>
                    {newTemplateFields.map((field, index) => (
                      <div key={index}>
                        {field.name} - {field.type}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-success mt-3"
                    onClick={handleCreateTemplate}
                  >
                    Create Template
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Display existing templates */}
      <div>
        {templates.map((template) => (
          <div key={template.id}>
            <h3>{template.name}</h3>
            {template.settings && (
              <ul>
                {JSON.parse(template.settings).map((field, index) => (
                  <li key={index}>
                    {field.name} - {field.type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
