import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./FullDashboard.module.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const FullDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    method: "card",
    card_number: "",
    account_type: "",
    name_on_account: "",
    account_number: "",
    routing_number: "",
    bank_name: "",
    raised_amount: 0, // Default value for raised_amount
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://161.35.19.77:8001/api/founder/campaigns/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      axios
        .get(
          `http://161.35.19.77:8001/api/founder/campaigns/${selectedCampaign}/approval-status/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => setApprovalStatus(response.data.approval_status))
        .catch((error) =>
          console.error("Error fetching approval status:", error)
        );
    }
  }, [selectedCampaign]);

  const handleAccordionClick = (index) => {
    setActiveAccordion(index);
  };

  const handleEditClick = () => {
    if (selectedCampaign) {
      navigate(`/editcampaign/${selectedCampaign}`);
    }
  };

  const getButtonText = () => {
    switch (approvalStatus) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Check Status";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        `http://161.35.19.77:8001/api/founder/campaigns/${selectedCampaign}/withdrawal-request/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Withdrawal request successful:", response.data);
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
    }
  };

  const renderAccordionContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <h1 className={styles.title_accordition_name}>
              Campaign Preparation
            </h1>
            <p>
              It is time to prepare your campaign for screening before
              publication
            </p>
            <button className={styles.button} onClick={handleEditClick}>
              Edit Campaign
            </button>
          </>
        );
      case 1:
        return (
          <>
            <h1 className={styles.title_accordition_name}>Screening</h1>
            <p>
              Your campaign is currently under screening process. We will send
              you a notification when the process is over
            </p>
            <h2>Current status:</h2>
            <button className={styles.button}>{getButtonText()}</button>
          </>
        );
      case 2:
        return (
          <>
            <h1 className={styles.title_accordition_name}>
              Approval and Legal Part
            </h1>
            <p className={styles.description}>
              Congratulations! Your campaign is approved for fundraising. <br />{" "}
              Please read all agreements below and put a tick in the box below.
            </p>
            <div className={styles.documents_section}>
              <h3>Documents:</h3>
              <div className={styles.documents_buttons}>
                <button className={styles.doc_button}>
                  Campaign Agreement
                </button>
                <button className={styles.doc_button}>
                  Terms and Conditions
                </button>
              </div>
            </div>
            <div className={styles.checkbox_section}>
              <input
                type="checkbox"
                id="agreement"
                name="agreement"
                className={styles.checkbox}
              />
              <label htmlFor="agreement" className={styles.checkbox_label}>
                I agree to the Terms & Campaign Agreement
              </label>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h1 className={styles.title_accordition_name}>
              Publication and Raising Money
            </h1>
            <p>
              It's time to get your first investment. <br />
              The best way to get it is to ask.
            </p>
            <input
              type="text"
              value={"https://fundflow.com/campaignname"}
              className={styles.input_raising_money}
            />
          </>
        );
      case 4:
        return (
          <>
            <h1 className={styles.title_accordition_name}>
              End of Campaign and Funding
            </h1>
            <p>
              Congratulations! Your hard work paid off and <br /> you raised
              $10,000 in this funding round.
            </p>
            <p>Now you can withdraw the money</p>
            <div className={styles.wrapper_all_money}>
              <form onSubmit={handleSubmit}>
                <div className={styles.methodSelection}>
                  <label htmlFor="payment_method">Select Payment Method:</label>
                  <select
                    id="payment_method"
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                  >
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                {formData.method === "card" && (
                  <div className={styles.cardSection}>
                    <label htmlFor="card_number">Card Number:</label>
                    <input
                      type="text"
                      id="card_number"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleInputChange}
                      placeholder="Card Number"
                    />
                  </div>
                )}

                {formData.method === "bank" && (
                  <div className={styles.bankSection}>
                    <label htmlFor="account_type">Account Type:</label>
                    <input
                      type="text"
                      id="account_type"
                      name="account_type"
                      value={formData.account_type}
                      onChange={handleInputChange}
                      placeholder="Account Type"
                    />
                    <label htmlFor="name_on_account">Name on Account:</label>
                    <input
                      type="text"
                      id="name_on_account"
                      name="name_on_account"
                      value={formData.name_on_account}
                      onChange={handleInputChange}
                      placeholder="Name on Account"
                    />
                    <label htmlFor="account_number">Account Number:</label>
                    <input
                      type="text"
                      id="account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      placeholder="Account Number"
                    />
                    <label htmlFor="routing_number">Routing Number:</label>
                    <input
                      type="text"
                      id="routing_number"
                      name="routing_number"
                      value={formData.routing_number}
                      onChange={handleInputChange}
                      placeholder="Routing Number"
                    />
                    <label htmlFor="bank_name">Bank Name:</label>
                    <input
                      type="text"
                      id="bank_name"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                      placeholder="Bank Name"
                    />
                  </div>
                )}

                <button type="submit" className={styles.button_acc_5}>
                  Submit Withdrawal Request
                </button>
              </form>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper_fulldashboard}>
      <Navbar />
      <div className={styles.wrapper_content_dashboard}>
        <nav className={styles.nav_campaign_dashboard}>
          <select
            className={styles.select_option}
            value={selectedCampaign || ""}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>

          <div className={styles.link_dashboard_campaign}>
            <Link
              className={
                selectedCampaign ? styles.link_dashboard : styles.link_disabled
              }
              to={selectedCampaign ? `/update/${selectedCampaign}` : "#"}
            >
              Post Update
            </Link>

            <Link
              className={
                selectedCampaign ? styles.link_dashboard : styles.link_disabled
              }
              to={selectedCampaign ? `/stats/${selectedCampaign}` : "#"}
            >
              View Stats
            </Link>

            <Link
              className={
                selectedCampaign ? styles.link_dashboard : styles.link_disabled
              }
              to={selectedCampaign ? `/editcampaign/${selectedCampaign}` : "#"}
            >
              Edit Campaign
            </Link>
          </div>
        </nav>

        {[0, 1, 2, 3, 4].map((step) => (
          <div key={step} className={styles.accordion_item}>
            <div
              className={styles.accordion_header}
              onClick={() => handleAccordionClick(step)}
            >
              <h1>Step {step + 1}</h1>
              <div className={styles.status}>
                {activeAccordion === step && (
                  <div className={styles.inProgressSection}>
                    <h3>In Progress</h3>
                  </div>
                )}
                <span>
                  {activeAccordion === step ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>
            </div>
            <div
              className={styles.accordion_content}
              style={{ display: activeAccordion === step ? "block" : "none" }}
            >
              {renderAccordionContent(step)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullDashboard;
