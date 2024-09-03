import React, { useState, useEffect } from "react";
import styles from "./TransactionHistory.module.scss";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [visibleItems, setVisibleItems] = useState(4);
  const [expanded, setExpanded] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://161.35.19.77:8001/api/investments/dashboard/history/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [token]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const handleShowMore = () => {
    if (expanded) {
      setVisibleItems(4);
    } else {
      setVisibleItems(transactions.length);
    }
    setExpanded(!expanded);
  };

  return (
    <div className={styles.transactionHistory}>
      <h2>Transactions History</h2>
      {transactions.length > 4 && (
        <p className={styles.showMoreButton} onClick={handleShowMore}>
          {expanded ? "Show Less" : "Show More"}
        </p>
      )}
      {transactions.slice(0, visibleItems).map((transaction, index) => (
        <div key={index} className={styles.transactionItem}>
          <div className={styles.transactionDate}>
            {formatDate(transaction.transaction_date)}
          </div>
          <div className={styles.transactionDetails}>
            <img
              src={transaction.campaign_image}
              alt="Transaction"
              className={styles.transactionIcon}
            />
            <div className={styles.transactionInfo}>
              <p className={styles.transactionTitle}>
                Invested into {transaction.campaign_name}
              </p>
              <p className={styles.transactionStatus}>Successfully finished</p>
            </div>
            <div>
              <div className={styles.transactionAmount}>
                {transaction.amount} USD
              </div>
              <div className={styles.transactionTime}>
                {formatTime(transaction.transaction_time)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
