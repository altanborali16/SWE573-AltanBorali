import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Card } from "react-bootstrap";
import Navbar from './Navbar';

const Community = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the community ID from the URL
  const [community, setCommunity] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateFields, setNewTemplateFields] = useState([]);
  const [fieldToAdd, setFieldToAdd] = useState({ name: "", type: "" });
  const [fieldTypes] = useState(["Text", "Number", "Date", "Bool"]);
  const [showModal, setShowModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [postformData, setPostFormData] = useState({ title: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState([]);

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
        console.log("community :", response.data);
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
        console.log("templates :", response.data);
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchTemplates(); // Call the fetch function on component mount

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/community/${id}/posts/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("posts :", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchPosts();
  }, [id]);

  if (!community) {
    return <div>Loading...</div>; // Placeholder for loading state
  }
  const handleAddField = () => {
    if (fieldToAdd.name === "" || fieldToAdd.type === "") return;
    setNewTemplateFields([...newTemplateFields, fieldToAdd]);
    setFieldToAdd({ name: "", type: "" });
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
  const handleCreatePost = async () => {
    if (!isFormValid()) {
      setErrorMessage("Please fill all fields.");
      console.log("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/posts/",
        {
          input: JSON.stringify(postformData),
          template_id: selectedTemplate.id,
          community_id: id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Post created:", response.data);
      // Clear form data and error message, and close the modal
      setPostFormData({ title: "" });
      setErrorMessage("");
      setShowPostModal(false);
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Error creating post. Please try again.");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const isFormValid = () => {
    if (!postformData.title.trim() || !selectedTemplate) {
      return false;
    }
    console.log("selectedTemplate.settings : ", selectedTemplate.settings);
    for (const field of JSON.parse(selectedTemplate.settings)) {
      console.log("NAme : ", field.name);
      const value = postformData[field.name.toLowerCase().replace(/\s/g, "_")];
      if (!value || value.trim() === "") {
        return false;
      }
    }
    return true;
  };
  const handleHomePage = () => {
    navigate("/home");
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleMyCommunities = () => {
    navigate("/usercommunities");
  };
  const handleCommunities = () => {
    navigate("/communities");
  };
  const handleUserSettings = () => {
    navigate("/userprofile");
  };

  return (
    <div className="container">
      {/* Navbar */}
      <Navbar
        handleHomePage={handleHomePage}
        handleSignOut={handleSignOut}
        handleMyCommunities={handleMyCommunities}
        handleCommunities={handleCommunities}
        handleUserSettings={handleUserSettings}
      />
      {/* Community details */}
      <div className="container">
        <h1>{community.name}</h1>
        <p>{community.description}, Created by {community.owner.username}, Subscribers {community.followers.length} </p>
        {/* <p>Owner: {community.owner.username}</p>
        <p>
          Managers:{" "}
          {community.managers.map((manager) => manager.username).join(", ")}
        </p>
        <p>
          Subscribers:{" "}
          {community.followers.length}
        </p> */}
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
            <Button
              variant="primary"
              onClick={() => {
                setSelectedTemplate(template);
                setShowPostModal(true);
              }}
            >
              Create Post
            </Button>
          </div>
        ))}
        {/* Modal for creating a new post */}
        <Modal
          show={showPostModal}
          onHide={() => {
            setShowPostModal(false);
            setErrorMessage("");
            setPostFormData({ title: "" });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Title is required.
                </Form.Control.Feedback>
              </Form.Group>
              {selectedTemplate &&
                JSON.parse(selectedTemplate.settings).map((field, index) => (
                  <Form.Group key={index}>
                    <Form.Label>{field.name}</Form.Label>
                    <Form.Control
                      type={field.type}
                      name={field.name.toLowerCase().replace(/\s/g, "_")}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {field.name} is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowPostModal(false);
                setErrorMessage("");
                setPostFormData({ title: "" });
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleCreatePost}>
              Create
            </Button>
          </Modal.Footer>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
        </Modal>
      </div>
      {/* Posts existing templates */}
      <h1>Community Posts</h1>
      {posts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            {post.input &&
              Object.keys(JSON.parse(post.input)).map((key, index) => (
                <div key={index}>
                  {key === "title" ? (
                    <Card.Title>{JSON.parse(post.input)[key]}</Card.Title>
                  ) : (
                    <Card.Text>
                      <strong>{key}:</strong> {JSON.parse(post.input)[key]}
                    </Card.Text>
                  )}
                </div>
              ))}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Community;
