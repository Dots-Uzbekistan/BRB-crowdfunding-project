import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import styles from "./Updates.module.scss";

const Updates = () => {
  const { id } = useParams();
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchUpdates = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/${id}/updates/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setUpdates(response.data);
      } catch (err) {
        setError("Failed to load updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [id]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = updates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(updates.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Loading updates...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.updatesWrapper}>
      {currentItems.length > 0 ? (
        currentItems.map((update) => (
          <motion.div
            key={update.id}
            className={styles.updateItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{update.title}</h3>
            <p>{update.description}</p>
            <p className={styles.date}>
              {new Date(update.created_at).toLocaleDateString()}
            </p>
          </motion.div>
        ))
      ) : (
        <p>No updates available.</p>
      )}
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className={styles.button_yellow_campaign}>
        <h1>Campaign launched</h1>
      </div>
    </div>
  );
};

export default Updates;
