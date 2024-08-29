import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Settings.module.scss";
import Navbar from "../Navbar/Navbar";
import FooterMini from "../../subcomponents/FooterMini/FooterMini";
import avatar from "../../assets/avatar.jpg";
import {
  FaCamera,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaKey,
} from "react-icons/fa";

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
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'

  const fileInputRef = useRef(null);

  // Fetch token from localStorage
  const token = localStorage.getItem("token");

  // Fetch user profile info on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://161.35.19.77:8001/api/users/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in headers
            },
          }
        );
        const { username, name, surname, email, phone_number, bio } =
          response.data;
        setUsername(username);
        setName(name);
        setSurname(surname);
        setEmail(email);
        setPhoneNumber(phone_number);
        setBio(bio);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }
    formData.append("bio", bio);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);

    try {
      const response = await axios.post(
        "/api/users/update-profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add token in headers
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

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setAlertType("error");
      return;
    }

    try {
      const response = await axios.post(
        "/api/users/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
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

  // Trigger file input
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Navbar />
      <div className={styles.settingsContainer}>
        <div className={styles.profileSection}>
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
                    src={
                      profileImage ? URL.createObjectURL(profileImage) : avatar
                    }
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
                  onChange={(e) => setProfileImage(e.target.files[0])}
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
                {/* <FaUser className={styles.icon} /> */}
                <textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={styles.textField}
                />
              </div>
              <div className={styles.formGroup}>
                {/* <FaPhoneAlt className={styles.icon} /> */}
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
                {/* <FaEnvelope className={styles.icon} /> */}
                <p>Email</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.textField_number}
                />
              </div>
            </div>
          </form>
        </div>

        <div className={styles.passwordSection}>
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.formGroup}>
              {/* <FaLock className={styles.icon} /> */}
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
              {/* <FaKey className={styles.icon} /> */}
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
              {/* <FaKey className={styles.icon} /> */}
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
        </div>
      </div>
      <FooterMini />
    </div>
  );
};

export default Settings;
