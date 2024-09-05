import React, { useState, useEffect } from "react";
import axios from "axios";

const Basics = ({ campaignId }) => {
  const initialFormData = {
    name: "",
    title: "",
    description: "",
    categories: [],
    project_state: "",
    location: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [initialData, setInitialData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
        setInitialData(response.data);
      } catch (error) {
        console.error("Fetch Error:", error); // Log detailed error
        if (error.response) {
          console.error("Response Error Data:", error.response.data);
          console.error("Response Error Status:", error.response.status);
          console.error("Response Error Headers:", error.response.headers);
        } else {
          console.error("Request Error Message:", error.message);
        }
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchData();
    }
  }, [campaignId, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        categories: checked
          ? [...prevData.categories, Number(value)]
          : prevData.categories.filter((id) => id !== Number(value)),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedData = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== initialData[key]) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});
      console.log("Updated Data:", updatedData);
      const response = await axios.patch(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/edit/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Patch Response:", response.data);
      alert("Campaign updated successfully");
    } catch (error) {
      console.error("Patch Error:", error); // Log detailed error
      if (error.response) {
        console.error("Response Error Data:", error.response.data);
        console.error("Response Error Status:", error.response.status);
        console.error("Response Error Headers:", error.response.headers);
      } else {
        console.error("Request Error Message:", error.message);
      }
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Campaign Basics</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Categories:
          <div>
            <label>
              <input
                type="checkbox"
                value="1"
                checked={formData.categories.includes(1)}
                onChange={handleChange}
              />
              Category 1
            </label>
            <label>
              <input
                type="checkbox"
                value="2"
                checked={formData.categories.includes(2)}
                onChange={handleChange}
              />
              Category 2
            </label>
          </div>
        </label>
        <br />
        <label>
          Project State:
          <select
            name="project_state"
            value={formData.project_state}
            onChange={handleChange}
          >
            <option value="concept">Concept</option>
            <option value="development">Development</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Basics;
