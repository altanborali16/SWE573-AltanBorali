import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Card } from "react-bootstrap";
import Navbar from "./Navbar";
// import PlacesAutocomplete from "react-places-autocomplete";
// import { LoadScript } from '@react-google-maps/api';

const Community = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the community ID from the URL
  const [community, setCommunity] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateFields, setNewTemplateFields] = useState([]);
  const [fieldToAdd, setFieldToAdd] = useState({ name: "", type: "" });
  const [fieldTypes] = useState(["Text", "Number", "Date", "Bool", "Url"]);  //"Location"
  const [showModal, setShowModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [postformData, setPostFormData] = useState({ title: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  // const [isSubscriber, setIsSubscriber] = useState(false);
  const [isManager, setIsManager] = useState(false);
  // const [address, setAddress] = useState("");
  // const libraries = ['places'];

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

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/current_user/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          setCurrentUser(response.data);
          console.log("Current User:", response.data);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      }
    };
    fetchCurrentUser();
  }, [id]);
  useEffect(() => {
    // Check if the community data and current user data are available
    if (community && currentUser) {
      // Check if the current user is the owner
      const isOwner = community.owner && community.owner.id === currentUser.id;
      // Check if the current user is a subscriber
      // const isSubscriber =
      //   community.followers && community.followers.includes(currentUser.id);
      // Check if the current user is a manager
      const isManager =
        community.managers && community.managers.includes(currentUser.id);
      setIsOwner(isOwner);
      // setIsSubscriber(isSubscriber);
      setIsManager(isManager);
      console.log(isOwner, isManager);
    }
  }, [community, currentUser]);

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
  // const handleSelect = (address) => {
  //   setAddress(address);
  //   handleInputChange({ target: { name: 'Location', value: address } });
  // };
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
        <p>
          {community.description}, Created by {community.owner.username},
          Subscribers {community.followers.length}{" "}
        </p>
      </div>
      {/* Templates section */}
      <h1>Community Templates</h1>
      {(isOwner || isManager) && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowModal(true)}
        >
          Create New Template
        </button>
      )}
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
        {/* <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={libraries}></LoadScript> */}
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
                    {field.type === "Bool" ? (
                      <Form.Check
                        type="checkbox"
                        name={field.name.toLowerCase().replace(/\s/g, "_")}
                        onChange={handleInputChange}
                      />
                    ) : field.type === "Url" ? (
                      <Form.Control
                        type="url"
                        name={field.name.toLowerCase().replace(/\s/g, "_")}
                        onChange={handleInputChange}
                        required
                      />
                    // ) : field.type === "Location" ? (
                    //   <PlacesAutocomplete
                    //     value={address}
                    //     onChange={setAddress}
                    //     onSelect={handleSelect}
                    //   >
                    //     {({
                    //       getInputProps,
                    //       suggestions,
                    //       getSuggestionItemProps,
                    //       loading,
                    //     }) => (
                    //       <div>
                    //         <Form.Control
                    //           {...getInputProps({
                    //             placeholder: "Search Places ...",
                    //             className: "location-search-input",
                    //           })}
                    //           required
                    //         />
                    //         <div className="autocomplete-dropdown-container">
                    //           {loading && <div>Loading...</div>}
                    //           {suggestions.map((suggestion) => {
                    //             const className = suggestion.active
                    //               ? "suggestion-item--active"
                    //               : "suggestion-item";
                    //             const style = suggestion.active
                    //               ? {
                    //                   backgroundColor: "#fafafa",
                    //                   cursor: "pointer",
                    //                 }
                    //               : {
                    //                   backgroundColor: "#ffffff",
                    //                   cursor: "pointer",
                    //                 };
                    //             return (
                    //               <div
                    //                 {...getSuggestionItemProps(suggestion, {
                    //                   className,
                    //                   style,
                    //                 })}
                    //               >
                    //                 <span>{suggestion.description}</span>
                    //               </div>
                    //             );
                    //           })}
                    //         </div>
                    //         <Form.Control.Feedback type="invalid">
                    //           Location is required.
                    //         </Form.Control.Feedback>
                    //       </div>
                    //     )}
                    //   </PlacesAutocomplete>
                    ) : (
                      <Form.Control
                        type={field.type}
                        name={field.name.toLowerCase().replace(/\s/g, "_")}
                        onChange={handleInputChange}
                        required
                      />
                    )}
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
