import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./Pitch.module.scss";

const Pitch = ({ campaignId }) => {
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPitch = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/pitch/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPitch(response.data.pitch); // Set the pitch content from the API
      } catch (error) {
        console.error("Error fetching the pitch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitch();
  }, [campaignId, token]);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/pitch/`,
        { pitch }, // Send the updated pitch content to the API
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Pitch updated:", response.data);
    } catch (error) {
      console.error("Error updating the pitch:", error);
    }
  };

  return (
    <div className={styles["pitch-container"]}>
      <div className={styles.title_pitch}>
        <h1>Pitch</h1>
        <p>
          Get investors excited about your story, growth, <br /> team, and
          vision. Why should they invest?
        </p>
      </div>
      <div>
        <div>
          <ReactQuill
            className={styles["quill-editor"]}
            theme="snow"
            value={pitch}
            onChange={setPitch}
            modules={Pitch.modules}
            formats={Pitch.formats}
          />
        </div>
        <button className={styles["save-button"]} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Customizing toolbar options
Pitch.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

Pitch.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default Pitch;
