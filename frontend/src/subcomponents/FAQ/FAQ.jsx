import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "@react-email/components";
import styles from "./FAQ.module.scss";
import { CiCircleChevUp, CiCircleChevDown } from "react-icons/ci";
import { useParams } from "react-router-dom";

const FAQ = () => {
  const { id } = useParams();
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [email, setEmail] = useState("");

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

    const fetchCampaignDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEmail(response.data.creator.email);
      } catch (error) {
        console.error("Failed to fetch campaign details", error);
        setError("Failed to fetch campaign details");
      }
    };

    fetchFaqs();
    fetchCampaignDetails();
  }, [id]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>{error}</p>;

  const subject = encodeURIComponent(`Question Regarding Campaign ${id}`);
  const body = encodeURIComponent(
    `I have a question regarding the campaign with ID ${id}.`
  );

  // Gmail URL for composing a new email
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

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
        <a href={gmailUrl} target="_blank" rel="noopener noreferrer">
          <button className={styles.btn_ask}>Ask Question</button>
        </a>
      </div>
    </div>
  );
};

export default FAQ;
