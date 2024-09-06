import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import styles from "./Basics.module.scss";

const Basics = ({ campaignId }) => {
  const initialFormData = {
    name: "",
    title: "",
    description: "",
    categories: "",
    project_state: "",
    location: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [initialData, setInitialData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [media, setMedia] = useState({ image: null, video: null });
  const [mediaError, setMediaError] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
        console.error("Fetch Error:", error);
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file, "image");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, "image");
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file, "video");
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, "video");
  };

  const handleFileUpload = (file, type) => {
    if (type === "image" && file && file.type.startsWith("image/")) {
      setMedia((prevMedia) => ({ ...prevMedia, image: file }));
      setMediaError(null);
    } else if (type === "video" && file && file.type.startsWith("video/")) {
      setMedia((prevMedia) => ({ ...prevMedia, video: file }));
      setMediaError(null);
    } else {
      setMediaError(
        `Invalid file type for ${type}. Please upload a valid ${type}.`
      );
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

      if (media.image || media.video) {
        const formData = new FormData();
        if (media.image) formData.append("image", media.image);
        if (media.video) formData.append("video", media.video);

        await axios.post(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/add-media/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Media uploaded successfully");
      }
    } catch (error) {
      console.error("Patch Error:", error);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Update Campaign Basics</h1>
      {loading && (
        <div className={styles.loading}>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#007bff"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}
      {error && <p className={styles.error}>Error: {error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>Categories:</label>
        <div className={styles.categories}>
          {["1", "2"].map((category) => (
            <div key={category} className={styles.radioWrapper}>
              <input
                type="radio"
                id={`category-${category}`}
                name="categories"
                value={category}
                checked={formData.categories === category}
                onChange={handleChange}
              />
              <label
                htmlFor={`category-${category}`}
                className={styles.customRadio}
              >
                <span className={styles.radioButton}></span>
                Category {category}
              </label>
            </div>
          ))}
        </div>
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
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>
        <div
          className={styles.dropzone}
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => imageInputRef.current.click()}
        >
          <p>Drag and drop an image here, or click to select a file</p>
          {media.image && <p>Selected image: {media.image.name}</p>}
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>
        <div
          className={styles.dropzone}
          onDrop={handleVideoDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => videoInputRef.current.click()}
        >
          <p>Drag and drop a video here, or click to select a file</p>
          {media.video && <p>Selected video: {media.video.name}</p>}
          <input
            type="file"
            ref={videoInputRef}
            style={{ display: "none" }}
            accept="video/*"
            onChange={handleVideoSelect}
          />
        </div>
        {mediaError && <p className={styles.error}>{mediaError}</p>}
        <button type="submit" className={styles.button}>
          Update
        </button>
      </form>
    </div>
  );
};

export default Basics;
