import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Team.module.scss";

const Team = ({ campaignId, onComplete }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    profile_picture: null,
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/team/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
    setIsDirty(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Only .jpg and .png files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size should not exceed 2MB.");
      return;
    }

    setError("");
    setNewMember({ ...newMember, profile_picture: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateForm = () => {
    if (!newMember.name || !newMember.role || !newMember.email) {
      setError("All fields must be filled.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newMember.email)) {
      setError("Invalid email format.");
      return false;
    }
    if (!newMember.profile_picture) {
      setError("Profile picture is required.");
      return false;
    }
    return true;
  };

  const handleAddTeamMember = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("role", newMember.role);
      formData.append("email", newMember.email);
      formData.append("profile_picture", newMember.profile_picture);

      const response = await axios.post(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/team/add/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTeamMembers([...teamMembers, response.data]);
      setNewMember({ name: "", role: "", email: "", profile_picture: null });
      setImagePreview(null);
      setError("");
      toast.success("Team member added successfully!");
      setIsDirty(true);
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Error adding team member.");
    }
  };

  const handleSaveChanges = async () => {
    if (!isDirty) {
      toast.success("No changes to save.");
      return;
    }

    try {
      const response = await axios.post(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/team/save/`,
        { teamMembers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Changes saved successfully!");
      setIsDirty(false);
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Error saving changes.");
    }
  };

  return (
    <div className={styles.teamContainer}>
      <ToastContainer />
      <h2>Team</h2>
      <p>
        Get investors excited about your team. Write about specific
        accomplishments that build credibility and trust.
      </p>

      <motion.div
        className={styles.teamForm}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={styles.profilePicInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label htmlFor="profilePicture">Add profile picture</label>
          <input
            id="profilePicture"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className={styles.dropArea}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className={styles.previewImage}
              />
            ) : (
              <p>Drag & drop an image or click to select</p>
            )}
          </div>
        </div>
        <div className={styles.inputFields}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={newMember.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={newMember.role}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newMember.email}
            onChange={handleInputChange}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          onClick={handleAddTeamMember}
          className={styles.addButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add team member
        </button>
      </motion.div>

      <motion.div
        className={styles.teamMembers}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className={styles.teamMemberCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={member.profile_picture} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <p>{member.email}</p>
          </motion.div>
        ))}
      </motion.div>

      <button
        className={styles.saveBtn}
        onClick={handleSaveChanges}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default Team;
