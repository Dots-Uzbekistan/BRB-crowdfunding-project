import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ContactsLinks.module.scss";

const ContactsLinks = ({ campaignId, onComplete }) => {
  const [links, setLinks] = useState({
    website: "",
    linkedin: "",
    facebook: "",
    telegram: "",
    instagram: "",
    custom: "https://fundflow.com/campaign-name",
  });
  const [newCustomLink, setNewCustomLink] = useState(links.custom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/links/list/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLinks({
          website:
            response.data.find((link) => link.platform === "website")?.link ||
            "",
          linkedin:
            response.data.find((link) => link.platform === "linkedin")?.link ||
            "",
          facebook:
            response.data.find((link) => link.platform === "facebook")?.link ||
            "",
          telegram:
            response.data.find((link) => link.platform === "telegram")?.link ||
            "",
          instagram:
            response.data.find((link) => link.platform === "instagram")?.link ||
            "",
          custom: "https://fundflow.com/campaign-name",
        });
        setNewCustomLink("https://fundflow.com/campaign-name");
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching links:",
          err.response?.data || err.message
        );
        setError(err);
        setLoading(false);
      }
    };

    fetchLinks();
  }, [campaignId, token]);

  const createPayload = () => {
    const payload = [];
    if (links.website)
      payload.push({ platform: "website", link: links.website });
    if (links.linkedin)
      payload.push({ platform: "linkedin", link: links.linkedin });
    if (links.facebook)
      payload.push({ platform: "facebook", link: links.facebook });
    if (links.telegram)
      payload.push({ platform: "telegram", link: links.telegram });
    if (links.instagram)
      payload.push({ platform: "instagram", link: links.instagram });
    if (newCustomLink)
      payload.push({ platform: "custom", link: newCustomLink });
    return payload;
  };

  const handleSaveLinks = async () => {
    const payload = createPayload();
    try {
      const response = await axios.post(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/links/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Links saved successfully!");
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Error saving links:", err.response?.data || err.message);
      toast.error("Error saving links.");
      setError(err);
    }
  };

  if (error)
    return <div>Error: {error.message || "Something went wrong."}</div>;

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1 className={styles.heading}>Contacts and Links</h1>
      <div className={styles.linksSection}>
        <div className={styles.inputGroup}>
          <label>Custom link</label>
          <div className={styles.customLink}>
            <input
              type="text"
              value={newCustomLink}
              onChange={(e) => setNewCustomLink(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
        {Object.entries({
          website: "Website",
          linkedin: "LinkedIn",
          facebook: "Facebook",
          instagram: "Instagram",
          telegram: "Telegram",
        }).map(([key, label]) => (
          <div className={styles.inputGroup} key={key}>
            <label>{label}</label>
            <input
              type="text"
              value={links[key]}
              onChange={(e) =>
                setLinks((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className={styles.input}
              placeholder={`Enter ${label} link`}
            />
          </div>
        ))}
        <button onClick={handleSaveLinks} className={styles.saveBtn}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ContactsLinks;
