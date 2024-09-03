import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import styles from "./VerifyIdentity.module.scss";
import oneid from "../../assets/oneid.png";
import quant from "../../assets/quant.png";
import { MdOutlineFileUpload, MdPictureAsPdf, MdImage } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const VerifyIdentity = () => {
  console.log("Retrieved token:", localStorage.getItem("token")); // or use context
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    passport_number: "",
    passport_document: null,
  });

  const [fileInfo, setFileInfo] = useState(null);
  const [role, setRole] = useState(null);
  const { setIsSuccessful, setRedirectPath, setUser, authToken } =
    useContext(AuthContext);
  const navigate = useNavigate();
  console.log("Retrieved token:", localStorage.getItem("token"));
  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    setRole(savedRole);
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));

    if (files) {
      setFileInfo({
        name: files[0].name,
        type: files[0].type,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("surname", formData.surname);
    data.append("email", formData.email);
    data.append("phone_number", formData.phone_number);
    data.append("passport_number", formData.passport_number);
    if (formData.passport_document) {
      data.append("passport_document", formData.passport_document);
    }
    if (role) {
      data.append("role", role);
    }
    // const token = localStorage.getItem(token);
    const token = localStorage.getItem("token"); // Corrected token retrieval

    console.log(token);
    if (!token) {
      console.error("No token found");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Ensure this token is valid
      },
    };

    try {
      const response = await axios.post(
        "http://161.35.19.77:8001/api/users/create-profile/",
        data,
        config
      );
      console.log("Profile created successfully:", response.data);
      setUser({ name: formData.name });
      setIsSuccessful(true);
      setRedirectPath("/dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
    }
  };

  const renderFileIcon = (fileType) => {
    if (fileType.includes("pdf")) {
      return <MdPictureAsPdf className={styles.fileIcon} />;
    } else if (fileType.includes("image")) {
      return <MdImage className={styles.fileIcon} />;
    } else {
      return <MdOutlineFileUpload className={styles.fileIcon} />;
    }
  };
  return (
    <section className={styles.verifyIdentity}>
      <div className={styles.left}>
        <svg
          className={styles.fund_logo}
          width="66"
          height="47"
          viewBox="0 0 66 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.576 10.352H7V22H2.212V10.352H0.476V6.376H2.212V5.928C2.212 4.00533 2.76267 2.54933 3.864 1.56C4.96533 0.551999 6.58 0.0479989 8.708 0.0479989C9.06267 0.0479989 9.324 0.0573321 9.492 0.0759985V4.136C8.57733 4.08 7.93333 4.21067 7.56 4.528C7.18667 4.84533 7 5.41467 7 6.236V6.376H9.576V10.352ZM27.2538 6.376V22H22.4658V19.872C21.9805 20.5627 21.3178 21.1227 20.4778 21.552C19.6565 21.9627 18.7418 22.168 17.7338 22.168C16.5392 22.168 15.4845 21.9067 14.5698 21.384C13.6552 20.8427 12.9458 20.068 12.4418 19.06C11.9378 18.052 11.6858 16.8667 11.6858 15.504V6.376H16.4458V14.86C16.4458 15.9053 16.7165 16.7173 17.2578 17.296C17.7992 17.8747 18.5272 18.164 19.4418 18.164C20.3752 18.164 21.1125 17.8747 21.6538 17.296C22.1952 16.7173 22.4658 15.9053 22.4658 14.86V6.376H27.2538ZM40.213 6.208C42.0424 6.208 43.4984 6.80533 44.581 8C45.6824 9.176 46.233 10.8 46.233 12.872V22H41.473V13.516C41.473 12.4707 41.2024 11.6587 40.661 11.08C40.1197 10.5013 39.3917 10.212 38.477 10.212C37.5624 10.212 36.8344 10.5013 36.293 11.08C35.7517 11.6587 35.481 12.4707 35.481 13.516V22H30.693V6.376H35.481V8.448C35.9664 7.75733 36.6197 7.216 37.441 6.824C38.2624 6.41333 39.1864 6.208 40.213 6.208ZM48.6082 14.16C48.6082 12.5547 48.9069 11.1453 49.5042 9.932C50.1202 8.71867 50.9509 7.78533 51.9962 7.132C53.0416 6.47867 54.2082 6.152 55.4962 6.152C56.5229 6.152 57.4562 6.36667 58.2962 6.796C59.1549 7.22533 59.8269 7.804 60.3122 8.532V1.28H65.1002V22H60.3122V19.76C59.8642 20.5067 59.2202 21.104 58.3802 21.552C57.5589 22 56.5976 22.224 55.4962 22.224C54.2082 22.224 53.0416 21.8973 51.9962 21.244C50.9509 20.572 50.1202 19.6293 49.5042 18.416C48.9069 17.184 48.6082 15.7653 48.6082 14.16ZM60.3122 14.188C60.3122 12.9933 59.9762 12.0507 59.3042 11.36C58.6509 10.6693 57.8482 10.324 56.8962 10.324C55.9442 10.324 55.1322 10.6693 54.4602 11.36C53.8069 12.032 53.4802 12.9653 53.4802 14.16C53.4802 15.3547 53.8069 16.3067 54.4602 17.016C55.1322 17.7067 55.9442 18.052 56.8962 18.052C57.8482 18.052 58.6509 17.7067 59.3042 17.016C59.9762 16.3253 60.3122 15.3827 60.3122 14.188ZM9.576 34.352H7V46H2.212V34.352H0.476V30.376H2.212V29.928C2.212 28.0053 2.76267 26.5493 3.864 25.56C4.96533 24.552 6.58 24.048 8.708 24.048C9.06267 24.048 9.324 24.0573 9.492 24.076V28.136C8.57733 28.08 7.93333 28.2107 7.56 28.528C7.18667 28.8453 7 29.4147 7 30.236V30.376H9.576V34.352ZM16.6138 25.28V46H11.8258V25.28H16.6138ZM27.1957 46.224C25.665 46.224 24.2837 45.8973 23.0517 45.244C21.8383 44.5907 20.877 43.6573 20.1677 42.444C19.477 41.2307 19.1317 39.812 19.1317 38.188C19.1317 36.5827 19.4863 35.1733 20.1957 33.96C20.905 32.728 21.8757 31.7853 23.1077 31.132C24.3397 30.4787 25.721 30.152 27.2517 30.152C28.7823 30.152 30.1637 30.4787 31.3957 31.132C32.6277 31.7853 33.5983 32.728 34.3077 33.96C35.017 35.1733 35.3717 36.5827 35.3717 38.188C35.3717 39.7933 35.0077 41.212 34.2797 42.444C33.5703 43.6573 32.5903 44.5907 31.3397 45.244C30.1077 45.8973 28.7263 46.224 27.1957 46.224ZM27.1957 42.08C28.1103 42.08 28.885 41.744 29.5197 41.072C30.173 40.4 30.4997 39.4387 30.4997 38.188C30.4997 36.9373 30.1823 35.976 29.5477 35.304C28.9317 34.632 28.1663 34.296 27.2517 34.296C26.3183 34.296 25.5437 34.632 24.9277 35.304C24.3117 35.9573 24.0037 36.9187 24.0037 38.188C24.0037 39.4387 24.3023 40.4 24.8997 41.072C25.5157 41.744 26.281 42.08 27.1957 42.08ZM60.3398 30.376L56.1118 46H50.8198L48.3558 35.864L45.8078 46H40.5438L36.2878 30.376H41.0758L43.2878 41.548L45.9198 30.376H50.9878L53.6478 41.492L55.8318 30.376H60.3398Z"
            fill="black"
          />
        </svg>
        <h1>
          Help us <span className={styles.highlight}>verify</span> <br /> your{" "}
          <span className={styles.highlight2}>identity</span>
        </h1>
        <p>
          Before you can invest, we’re <br /> required by law to collect some{" "}
          <br />
          information about you.
        </p>
      </div>
      <div className={styles.right}>
        <form className={styles.formGroup} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Mobile Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="passport_number"
            placeholder="Passport ID"
            value={formData.passport_number}
            onChange={handleChange}
            required
          />
          <p className={styles.idpassport}>
            Please Upload your Passport/ID here:
          </p>
          <label className={styles.uploadLabel}>
            <input
              type="file"
              name="passport_document"
              onChange={handleChange}
              accept="image/*,application/pdf"
              required
            />
            <span>
              <MdOutlineFileUpload className={styles.upload_icon} />
              click here to select or drop
            </span>
            {fileInfo && (
              <div className={styles.fileInfo}>
                {renderFileIcon(fileInfo.type)}
                <p>{fileInfo.name}</p>
              </div>
            )}
          </label>

          <button className={styles.registerBtn} type="submit">
            Submit and Register
          </button>
        </form>

        <p className={styles.continue}>or continue with</p>
        <div className={styles.continueOptions}>
          <button className={styles.continueBtn_oneid}>
            <img src={oneid} alt="OneID logo" />
            <span>OneID</span>
          </button>
          <button className={styles.continueBtn_quant}>
            <img src={quant} alt="Quant bank logo" />
            Quant bank account
          </button>
        </div>
      </div>
    </section>
  );
};

export default VerifyIdentity;
