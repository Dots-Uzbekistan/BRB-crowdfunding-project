import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./InvestmentList.module.scss";
import { ThreeDots } from "react-loader-spinner";

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://161.35.19.77:8001/api/investments/dashboard/ending-soon/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setInvestments(response.data);
      } catch (error) {
        console.error(
          "There was an error fetching the investment data:",
          error
        );
        setError("Failed to fetch investments.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const itemsToShow = showMore ? investments.length : 4;

  return (
    <div className={styles.investments}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <ThreeDots
            height="100"
            width="100"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          {error && <p>{error}</p>}
          {investments.length > 0 ? (
            <>
              {investments.slice(0, itemsToShow).map((investment, index) => (
                <div key={index} className={styles.investmentCard}>
                  <div className={styles.info_title_investment_card}>
                    <div className={styles.desc_investment}>
                      <h4>{investment.campaign_title}</h4>
                      <p>{investment.percent_raised} raised</p>
                      <p>{investment.days_left} days left</p>
                      <p>Your equity {investment.user_equity}</p>
                    </div>
                    <img
                      src={investment.campaign_image || "default-image.jpg"}
                      alt={investment.campaign_title || "Investment Image"}
                      className={styles.campaignImage}
                    />
                  </div>
                  <div className={styles.raised}>
                    <p>Raised</p>
                    <h1>{investment.raised_amount}</h1>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>You didn't invest yet</p>
          )}
        </>
      )}
      {investments.length > 4 && (
        <p
          onClick={() => setShowMore(!showMore)}
          className={styles.showMoreButton}
        >
          {showMore ? "Show Less" : "Show More"}
        </p>
      )}
    </div>
  );
};

export default InvestmentList;
