import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Already imported useParams
import Navbar from "../../components/Navbar/Navbar";
import styles from "./UpdateCampaign.module.scss";

const UpdateCampaign = () => {
  const { id } = useParams(); // Access the dynamic campaign ID from the URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`Posting update to Campaign ID: ${id}`);
    console.log("Update data:", { title, content });

    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    try {
      const response = await fetch(
        `http://161.35.19.77:8001/api/founder/campaigns/${id}/updates/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Failed to post update for Campaign ID: ${id}`,
          errorData
        );
      } else {
        console.log(`Update posted successfully for Campaign ID: ${id}`);
      }
    } catch (error) {
      console.error("Error posting update:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.updateCampaignContainer}>
        <a href="/dashboard" className={styles.backButton}>
          &lt; Back
        </a>
        <h2 className={styles.header}>Post update for Campaign ID: {id}</h2>{" "}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Update details</label>
            <textarea
              className={styles.textArea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.publishButton}>
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCampaign;
