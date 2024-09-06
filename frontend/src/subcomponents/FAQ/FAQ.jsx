import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./FAQ.module.scss"; // Ensure this file exists for styling
import { CiCircleChevUp } from "react-icons/ci";
import { CiCircleChevDown } from "react-icons/ci";
const FAQ = () => {
  const { id } = useParams();
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Default to the first FAQ being open

  useEffect(() => {
    const fetchFaqs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/${id}/faqs/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setFaqs(response.data);
      } catch (err) {
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [id]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.faq_wrapper}>
      <div className={styles.faqContainer}>
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <div key={faq.id} className={styles.accordionItem}>
              <div
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(index)}
              >
                <h3>{faq.question}</h3>
                <span>
                  {activeIndex === index ? (
                    <CiCircleChevUp />
                  ) : (
                    <CiCircleChevDown />
                  )}
                </span>
              </div>
              {activeIndex === index && (
                <div className={styles.accordionContent}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No FAQs available.</p>
        )}
      </div>
      <div className={styles.ask_question}>
        <h3>
          Don’t see the answer to <br /> your question? Ask here{" "}
        </h3>
        <button className={styles.btn_ask}>Ask Question</button>
      </div>
    </div>
  );
};

export default FAQ;
