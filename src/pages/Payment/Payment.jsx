import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import FooterMini from "../../subcomponents/FooterMini/FooterMini";
import styles from "./Payment.module.scss";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const Payment = () => {
  const [fullName, setFullName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [address, setAddress] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [error, setError] = useState(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const { campaign_id } = useParams();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/${campaign_id}/invest/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setFullName(data.full_name);
          setCampaignName(data.campaign_name);
          setAddress(data.address);
          setMinInvestment(data.min_investment);
        } else {
          setError(`API returned status code ${response.status}`);
        }
      } catch (err) {
        if (err.response) {
          setError(
            `Error: ${err.response.data.detail || "Something went wrong."}`
          );
        } else if (err.request) {
          setError("Error: No response from server.");
        } else {
          setError("Error: " + err.message);
        }
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchPaymentDetails();
  }, [campaign_id]);

  const handleInvestmentChange = (e) => {
    setInvestmentAmount(e.target.value);
  };

  const isValidInvestment = () => {
    return parseFloat(investmentAmount) >= parseFloat(minInvestment);
  };

  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkboxChecked) {
      setError("You must agree to the terms and conditions to proceed.");
      return;
    }

    if (!isValidInvestment()) {
      setError(
        "Investment amount must be greater than or equal to the minimum investment."
      );
      return;
    }

    setLoading(true); // Show loader

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://161.35.19.77:8001/api/investments/create-investment/",
        {
          investment_amount_usd: investmentAmount,
          campaign_id: campaign_id,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // 201 Created
        const data = response.data;
        const paymentLink = data.payment_link;

        // Redirect to the payment page
        window.location.href = paymentLink;
      } else {
        setError(`Unexpected response status code ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        setError(
          `Error: ${err.response.data.detail || "Something went wrong."}`
        );
      } else if (err.request) {
        setError("Error: No response from server.");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className={styles.wrapper_payment}>
      <Navbar />
      <div className={styles.container_payment}>
        <h1 className={styles.heading}>
          Invest in <span className={styles.campaign_name}>{campaignName}</span>
        </h1>
        <div className={styles.cont_payment}>
          {loading ? (
            <div className={styles.loader_container}>
              <ThreeDots
                height="80"
                width="80"
                color="4fa94d"
                ariaLabel="three-dots-loading"
              />
            </div>
          ) : (
            <>
              <h1>1. Investment amount</h1>
              <div className={styles.investment_section}>
                <span className={styles.currency_symbol}>$</span>

                <input
                  type="number"
                  value={investmentAmount}
                  onChange={handleInvestmentChange}
                  placeholder={`${minInvestment} min.`}
                  className={`${styles.investment_input} ${
                    isValidInvestment() ? "" : styles.invalid_input
                  }`}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.section_second_wrapper}>
                <div className={styles.section_left}>
                  <h1>2. Investor Information</h1>
                  <div className={styles.form_group}>
                    <label>Full Name:</label>
                    <input
                      type="text"
                      value={fullName}
                      disabled
                      className={styles.input_field}
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label>Address:</label>
                    <input
                      type="text"
                      value={address}
                      disabled
                      className={styles.input_field}
                    />
                  </div>
                  <div className={styles.deal_terms_section}>
                    <h1 className={styles.section_heading}>3. Deal Terms</h1>
                    <div className={styles.priced_round}>
                      <h2>Priced Round</h2>
                      <p>
                        $18M $24M pre-money valuation | $0.7376 $0.9835 share
                        price
                        <br />
                        If you invest, you're betting “{campaignName}” will be
                        worth more than $17.982M in the future.
                      </p>
                    </div>
                    <div className={styles.contracts_section}>
                      <h2>Contracts</h2>
                      <ul className={styles.contracts_list}>
                        <li>
                          <span>SPV Subscription Agreement - Early Bird</span>
                          <a href="#" className={styles.download_link}>
                            Download
                          </a>
                        </li>
                        <li>
                          <span>SPV Subscription Agreement - Early Bird</span>
                          <a href="#" className={styles.download_link}>
                            Download
                          </a>
                        </li>
                        <li>
                          <span>SPV Subscription Agreement - Early Bird</span>
                          <a href="#" className={styles.download_link}>
                            Download
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.section_right_wrapper}>
                  <h1>4. Legal Stuff</h1>
                  <div className={styles.section_right}>
                    <div className={styles.terms_desc}>
                      <p>
                        I’ve read the Investor FAQ. I understand startups are
                        risky and can afford to lose my entire investment.
                      </p>
                      <p>
                        I understand these investments are not easily resold. I
                        can wait years for a return.
                      </p>
                      <p>
                        I understand FundFlow does not offer investment advice.
                        I am making my own investment decisions.
                      </p>
                      <p>I am complying with my annual investment limit.</p>
                      <p>
                        I understand that I may cancel anytime until four days
                        after making my investment or until my funds are
                        disbursed, whichever is later.
                      </p>
                      <p>
                        I agree to the contracts with my electronic signature
                        and authorize Wefunder to debit my account.
                      </p>
                    </div>
                    <div className={styles.button_checkbox}>
                      <input
                        type="checkbox"
                        required
                        className={styles.customCheckbox}
                        checked={checkboxChecked}
                        onChange={handleCheckboxChange}
                      />
                      <p>I agree to this and the Terms & Investor Agreement</p>
                    </div>
                  </div>
                  <button
                    className={styles.button_payment_next}
                    onClick={handleSubmit}
                  >
                    <p>Next</p>
                    <svg
                      width="27"
                      height="27"
                      viewBox="0 0 31 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.102783 0.210393H11.8064L30.4996 18.6598L11.8064 37.1092H0.102783L18.8773 18.6598L0.102783 0.210393Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <FooterMini />
    </div>
  );
};

export default Payment;
