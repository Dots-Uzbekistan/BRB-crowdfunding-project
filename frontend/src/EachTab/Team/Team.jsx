import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Team.module.scss"; // Import SCSS module

const Team = ({ campaignId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    profile_picture: null,
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  // Fetch token from local storage
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/team/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value,
    });
  };

  // Handle file input with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Only .jpg and .png files are allowed.");
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size should not exceed 2MB.");
      return;
    }

    setError("");
    setNewMember({
      ...newMember,
      profile_picture: file,
    });

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validation for inputs
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

  // Add a new team member
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
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  return (
    <div className={styles.teamContainer}>
      <h2>Team</h2>
      <p>
        Get investors excited about your team. Write about specific
        accomplishments that build credibility and trust.
      </p>

      <div className={styles.teamForm}>
        <div className={styles.profilePicInput}>
          <label htmlFor="profilePicture">Add profile picture</label>
          <input id="profilePicture" type="file" onChange={handleFileChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className={styles.previewImage}
            />
          )}
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
        <button onClick={handleAddTeamMember} className={styles.addButton}>
          + Add team member
        </button>
      </div>

      <div className={styles.teamMembers}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.teamMemberCard}>
            <img src={member.profile_picture} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <p>{member.email}</p>
          </div>
        ))}
      </div>

      <button className={styles.saveBtn}>Save Changes</button>
    </div>
  );
};

export default Team;
