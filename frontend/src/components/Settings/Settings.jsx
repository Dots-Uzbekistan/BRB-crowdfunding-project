import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Settings.module.scss";
import Navbar from "../Navbar/Navbar";
import FooterMini from "../../subcomponents/FooterMini/FooterMini";
import avatar from "../../assets/avatar.jpg";
import { FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";

const Settings = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://161.35.19.77:8001/api/users/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const {
          username,
          name,
          surname,
          email,
          phone_number,
          bio,
          profile_image,
        } = response.data;
        setUsername(username);
        setName(name);
        setSurname(surname);
        setEmail(email);
        setPhoneNumber(phone_number);
        setBio(bio);
        setProfileImage(profile_image);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);
    try {
      const response = await axios.put(
        "http://161.35.19.77:8001/api/users/update-profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.profile_image) {
        setProfileImage(response.data.profile_image);
        setAlertMessage("Profile image updated successfully.");
        setAlertType("success");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      setAlertMessage(
        `Error uploading image: ${
          error.response?.data?.message || error.message
        }`
      );
      setAlertType("error");
      console.error("Error uploading image:", error.response || error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);

    try {
      const response = await axios.put(
        "http://161.35.19.77:8001/api/users/update-profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertMessage("Profile updated successfully.");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Error updating profile. Please try again.");
      setAlertType("error");
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setAlertType("error");
      return;
    }

    try {
      const response = await axios.post(
        "http://161.35.19.77:8001/api/auth/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertMessage("Password changed successfully.");
      setAlertType("success");
    } catch (error) {
      setAlertMessage("Error changing password. Please try again.");
      setAlertType("error");
      console.error("Error changing password:", error);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Navbar />
      <div className={styles.settingsContainer}>
        <motion.div
          className={styles.profileSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Settings</h2>

          {alertMessage && (
            <div className={`${styles.alert} ${styles[alertType]}`}>
              {alertMessage}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className={styles.left_setting_title}>
              <div className={styles.profileImage}>
                <label htmlFor="profileImage" className={styles.imageLabel}>
                  <img
                    src={profileImage ? profileImage : avatar}
                    alt="Profile"
                    className={styles.img_settings}
                  />
                  <FaCamera
                    className={styles.cameraIcon}
                    onClick={handleClick}
                  />
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div className={styles.profileHeader}>
                <h3>{username}</h3>
                <p>
                  {name} {surname}
                </p>
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.formGroup}>
                <textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={styles.textField}
                />
              </div>
              <div className={styles.formGroup}>
                <p>Mobile number</p>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={styles.textField_number}
                />
              </div>
              <div className={styles.formGroup}>
                <p>Email</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.textField_number}
                />
              </div>
              <button type="submit" className={styles.applyButton}>
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          className={styles.passwordSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.formGroup}>
              <p>Old Password</p>
              <input
                type="password"
                placeholder="Please type old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={styles.textField}
              />
            </div>
            <div className={styles.formGroup}>
              <p>New Password</p>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.textField}
              />
            </div>
            <div className={styles.formGroup}>
              <p>Confirm new password</p>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.textField}
              />
            </div>
            <button type="submit" className={styles.applyButton}>
              Apply Changes
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
