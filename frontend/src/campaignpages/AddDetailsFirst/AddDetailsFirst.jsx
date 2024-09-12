import React, { useEffect, useState } from "react";
import styles from "./AddDetailsFirst.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import FooterMini from "../../subcomponents/FooterMini/FooterMini";
import axios from "axios";
import { FaLightbulb, FaCog, FaStore, FaCheckCircle } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";

const AddDetailsFirst = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    projectDescription: "",
    category: "",
    projectState: "Concept",
    location: "",
    fundingType: "equity",
    fundraisingGoal: "",
    additionalInfo: "",
  });
  const [categories, setCategories] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [charCountAdditional, setCharCountAdditional] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedProjectName = localStorage.getItem("projectName");
    const storedToken = localStorage.getItem("token");

    if (storedProjectName) {
      setProjectName(storedProjectName);
    }
    if (storedToken) {
      setToken(storedToken);
    }

    if (storedToken) {
      axios
        .get("http://161.35.19.77:8001/api/catalog/categories/", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => setCategories(response.data))
        .catch((error) => console.error("Error fetching categories:", error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "projectDescription") {
      if (value.length <= 255) {
        setFormData({ ...formData, [name]: value });
        setCharCount(value.length);
      }
    } else if (name === "additionalInfo") {
      if (value.length <= 255) {
        setFormData({ ...formData, [name]: value });
        setCharCountAdditional(value.length);
      }
    } else if (name === "fundraisingGoal") {
      const formattedValue = value.replace(/[^\d.]/g, "");
      setFormData({ ...formData, fundraisingGoal: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    const data = {
      name: projectName,
      description: formData.projectDescription,
      categories: [formData.category],
      project_state: formData.projectState.toLowerCase(),
      location: formData.location,
      investment_type: formData.fundingType.toLowerCase(),
      goal_amount: formData.fundraisingGoal,
      extra_info: formData.additionalInfo,
    };

    axios
      .post("http://161.35.19.77:8001/api/founder/campaigns/register/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response:", response.data);

        const campaignId = response.data.id;
        navigate(`/fulldashboard`, { state: { campaignId } });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.error("Validation errors:", error.response.data);
          setErrors(error.response.data);
        } else {
          console.error("Error registering campaign:", error);
        }
      });
  };

  const stages = [
    { name: "Concept", icon: <FaLightbulb /> },
    { name: "Prototype", icon: <FaCog /> },
    { name: "Production", icon: <FaStore /> },
    { name: "Launched", icon: <FaCheckCircle /> },
  ];

  return (
    <div className={styles.wrapper_first_add_details}>
      <Navbar />
      <div className={styles.wrapper_content_first_addition}>
        <h1>
          Few more steps before <br /> you <span>start your campaign</span>
        </h1>
        <div className={styles.wrapper_input_addition}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
              {/* 1. Project Description */}
              <div className={styles.formGroup}>
                <label className={styles.cont_textarea_wrapper}>
                  1. What is your project about?
                  <p>{charCount}/255</p>
                  {errors.description && (
                    <p className={styles.errorText}>{errors.description[0]}</p>
                  )}
                </label>
                <textarea
                  name="projectDescription"
                  placeholder="Provide a short description (max 255 characters)..."
                  value={formData.projectDescription}
                  onChange={handleChange}
                />
              </div>

              {/* 2. Category Selection */}
              <div className={styles.formGroup}>
                <label>2. Which category best fits your project?</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categories && (
                  <p className={styles.errorText}>{errors.categories[0]}</p>
                )}
              </div>

              {/* 3. Project State Selection */}
              <div className={styles.formGroup}>
                <label>3. What stage is your project currently in?</label>
                <div className={styles.stages}>
                  {stages.map((stage) => (
                    <label
                      key={stage.name}
                      className={`${styles.stage} ${
                        formData.projectState === stage.name
                          ? styles.activeStage
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="projectState"
                        value={stage.name}
                        checked={formData.projectState === stage.name}
                        onChange={handleChange}
                      />
                      <span className={styles.stageIcon}>{stage.icon}</span>
                      {stage.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Project Location */}
              <div className={styles.formGroup}>
                <label>4. Where is your project based?</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location (e.g., City, Country)"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              {/* 5. Funding Type Selection */}
              <div className={styles.formGroup}>
                <label>
                  5. Which type of funding is most suitable for your project?
                </label>
                <div className={styles.funding_type_wrapper_radio}>
                  <div className={styles.radio_fundings}>
                    <input
                      type="radio"
                      name="fundingType"
                      value="equity"
                      checked={formData.fundingType === "equity"}
                      onChange={handleChange}
                    />
                    <p>Equity-based (Investors get a share of the project)</p>
                  </div>
                  <div className={styles.radio_fundings}>
                    <input
                      type="radio"
                      name="fundingType"
                      value="donation"
                      checked={formData.fundingType === "donation"}
                      onChange={handleChange}
                    />
                    <p>Donation-based (Support with no returns)</p>
                  </div>
                </div>
              </div>

              {/* 6. Fundraising Goal */}
              <div className={styles.formGroup}>
                <label>
                  6. What is your fundraising goal for this project?
                </label>
                <input
                  type="text"
                  name="fundraisingGoal"
                  placeholder="$100000"
                  value={`$${formData.fundraisingGoal}`}
                  onChange={handleChange}
                />
                {errors.goal_amount && (
                  <p className={styles.errorText}>{errors.goal_amount[0]}</p>
                )}
              </div>

              {/* 7. Additional Information */}
              <div className={styles.formGroup}>
                <label className={styles.cont_textarea_wrapper}>
                  7. Is there anything you'd like us to know? (Optional)
                  <p>{charCountAdditional}/255</p>{" "}
                  {/* Display character count */}
                  {errors.description && (
                    <p className={styles.errorText}>{errors.description[0]}</p>
                  )}
                </label>
                <textarea
                  name="additionalInfo"
                  placeholder="Tell us anything that might help us better understand your project"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton}>
                Set up my campaign
              </button>
            </div>
          </form>
        </div>
      </div>
      <FooterMini />
    </div>
  );
};

export default AddDetailsFirst;
