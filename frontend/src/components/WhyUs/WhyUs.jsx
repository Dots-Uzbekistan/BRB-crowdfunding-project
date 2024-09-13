import React from "react";
import styles from "./WhyUs.module.scss";
import { motion } from "framer-motion";
import { LineChart } from "@mui/x-charts/LineChart";

const WhyUs = () => {
  return (
    <section className={styles.wrapper_us}>
      <motion.div
        className={styles.left_us}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className={styles.text_us}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Why create <br /> on Fundflow?
        </motion.p>
        <motion.article
          className={styles.cont_us_yellow}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className={styles.text_yellow}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Use our collaboration <br /> tools to reach
          </motion.p>
          <motion.p
            className={styles.number_info_yellow}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            23% more investors
          </motion.p>
        </motion.article>
      </motion.div>
      <div className={styles.right_us}>
        <div className={styles.right_us_containers}>
          <motion.article
            className={styles.purple}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              width="220"
              height="221"
              viewBox="0 0 254 221"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M175.832 0C132.754 0 97.832 35.1457 97.832 78.5C97.832 121.854 132.754 157 175.832 157H214.832C226.947 157 233.004 157 237.782 155.008C244.153 152.352 249.214 147.258 251.853 140.847C253.832 136.038 253.832 129.942 253.832 117.75V78.5C253.832 35.1457 218.91 0 175.832 0ZM141.164 69.7777C141.164 64.9606 145.045 61.0555 149.831 61.0555H201.831C206.618 61.0555 210.498 64.9606 210.498 69.7777C210.498 74.5949 206.618 78.5 201.831 78.5H149.831C145.045 78.5 141.164 74.5949 141.164 69.7777ZM167.164 104.667C167.164 99.8495 171.045 95.9444 175.831 95.9444H201.831C206.618 95.9444 210.498 99.8495 210.498 104.667C210.498 109.484 206.618 113.389 201.831 113.389H175.831C171.045 113.389 167.164 109.484 167.164 104.667Z"
                fill="#E8FC85"
              />
              <mask id="path-2-inside-1_235_387" fill="white">
                <path d="M108 78.3333C108 40.5939 138.594 10 176.334 10C214.073 10 244.667 40.5939 244.667 78.3334V121.818C244.667 129.05 244.667 132.666 243.59 135.553C241.858 140.196 238.196 143.858 233.554 145.59C230.666 146.667 227.05 146.667 219.819 146.667H176.334C138.594 146.667 108 116.073 108 78.3333Z" />
              </mask>
              <path
                d="M150.71 75.7916C147.396 75.7916 144.71 73.1053 144.71 69.7916C144.71 66.4779 147.396 63.7916 150.71 63.7916V75.7916ZM201.96 63.7916C205.273 63.7916 207.96 66.4779 207.96 69.7916C207.96 73.1053 205.273 75.7916 201.96 75.7916V63.7916ZM176.335 109.958C173.021 109.958 170.335 107.272 170.335 103.958C170.335 100.645 173.021 97.9583 176.335 97.9583V109.958ZM201.96 97.9583C205.273 97.9583 207.96 100.645 207.96 103.958C207.96 107.272 205.273 109.958 201.96 109.958V97.9583ZM150.71 63.7916H201.96V75.7916H150.71V63.7916ZM176.335 97.9583H201.96V109.958H176.335V97.9583ZM243.59 135.553L254.833 139.747L243.59 135.553ZM233.554 145.59L237.747 156.833L233.554 145.59ZM256.667 78.3334V121.818H232.667V78.3334H256.667ZM219.819 158.667H176.334V134.667H219.819V158.667ZM176.334 158.667C131.967 158.667 96.0003 122.7 96.0003 78.3333H120C120 109.445 145.222 134.667 176.334 134.667V158.667ZM256.667 121.818C256.667 125.285 256.672 128.431 256.509 131.058C256.34 133.78 255.958 136.73 254.833 139.747L232.346 131.36C232.298 131.489 232.455 131.187 232.555 129.571C232.662 127.86 232.667 125.583 232.667 121.818H256.667ZM219.819 134.667C223.583 134.667 225.861 134.661 227.571 134.555C229.188 134.455 229.489 134.298 229.36 134.346L237.747 156.833C234.73 157.958 231.78 158.34 229.058 158.509C226.432 158.672 223.285 158.667 219.819 158.667V134.667ZM254.833 139.747C251.885 147.651 245.651 153.885 237.747 156.833L229.36 134.346C230.742 133.831 231.831 132.741 232.346 131.36L254.833 139.747ZM176.334 -2C220.701 -2 256.667 33.9665 256.667 78.3334H232.667C232.667 47.2213 207.446 22 176.334 22V-2ZM176.334 22C145.222 22 120 47.2213 120 78.3333H96.0003C96.0003 33.9665 131.967 -2 176.334 -2V22Z"
                fill="black"
                mask="url(#path-2-inside-1_235_387)"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M78 64C121.078 64 156 99.1457 156 142.5C156 185.854 121.078 221 78 221H39C26.8855 221 20.8283 221 16.0502 219.008C9.6795 216.352 4.61798 211.258 1.97913 204.847C1.2517e-06 200.038 1.2517e-06 193.942 1.2517e-06 181.75V142.5C1.2517e-06 99.1457 34.9218 64 78 64ZM112.668 133.778C112.668 128.961 108.787 125.056 104.001 125.056H52.001C47.2145 125.056 43.3343 128.961 43.3343 133.778C43.3343 138.595 47.2145 142.5 52.001 142.5H104.001C108.787 142.5 112.668 138.595 112.668 133.778ZM86.6676 168.667C86.6676 163.849 82.7874 159.944 78.001 159.944H52.001C47.2145 159.944 43.3343 163.849 43.3343 168.667C43.3343 173.484 47.2145 177.389 52.001 177.389H78.001C82.7874 177.389 86.6676 173.484 86.6676 168.667Z"
                fill="#A5FFB8"
                fill-opacity="0.7"
              />
              <mask id="path-5-inside-2_235_387" fill="white">
                <path d="M146.667 142.333C146.667 104.594 116.073 74 78.3333 74C40.5939 74 10 104.594 10 142.333V185.818C10 193.05 10 196.666 11.0771 199.553C12.8087 204.196 16.4707 207.858 21.1133 209.59C24.0012 210.667 27.6169 210.667 34.8485 210.667H78.3334C116.073 210.667 146.667 180.073 146.667 142.333Z" />
              </mask>
              <path
                d="M103.957 139.792C107.271 139.792 109.957 137.105 109.957 133.792C109.957 130.478 107.271 127.792 103.957 127.792V139.792ZM52.7073 127.792C49.3936 127.792 46.7073 130.478 46.7073 133.792C46.7073 137.105 49.3936 139.792 52.7073 139.792V127.792ZM78.3323 173.958C81.646 173.958 84.3323 171.272 84.3323 167.958C84.3323 164.645 81.646 161.958 78.3323 161.958V173.958ZM52.7073 161.958C49.3936 161.958 46.7073 164.645 46.7073 167.958C46.7073 171.272 49.3936 173.958 52.7073 173.958V161.958ZM103.957 127.792H52.7073V139.792H103.957V127.792ZM78.3323 161.958H52.7073V173.958H78.3323V161.958ZM11.0771 199.553L-0.166286 203.747L11.0771 199.553ZM21.1133 209.59L16.9197 220.833L21.1133 209.59ZM-2 142.333V185.818H22V142.333H-2ZM34.8485 222.667H78.3334V198.667H34.8485V222.667ZM78.3334 222.667C122.7 222.667 158.667 186.7 158.667 142.333H134.667C134.667 173.445 109.445 198.667 78.3334 198.667V222.667ZM-2 185.818C-2 189.285 -2.00538 192.431 -1.84231 195.058C-1.67335 197.78 -1.2915 200.73 -0.166286 203.747L22.3205 195.36C22.3686 195.489 22.2119 195.187 22.1116 193.571C22.0054 191.86 22 189.583 22 185.818H-2ZM34.8485 198.667C31.0837 198.667 28.8064 198.661 27.0955 198.555C25.4795 198.455 25.1779 198.298 25.3069 198.346L16.9197 220.833C19.9366 221.958 22.8868 222.34 25.6085 222.509C28.2354 222.672 31.3817 222.667 34.8485 222.667V198.667ZM-0.166286 203.747C2.78165 211.651 9.01601 217.885 16.9197 220.833L25.3069 198.346C23.9254 197.831 22.8358 196.741 22.3205 195.36L-0.166286 203.747ZM78.3333 62C33.9665 62 -2 97.9665 -2 142.333H22C22 111.221 47.2213 86 78.3333 86V62ZM78.3333 86C109.445 86 134.667 111.221 134.667 142.333H158.667C158.667 97.9665 122.7 62 78.3333 62V86Z"
                fill="black"
                mask="url(#path-5-inside-2_235_387)"
              />
            </svg>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Build audience and interact with them{" "}
            </motion.p>
          </motion.article>
          <motion.article
            className={styles.green_us}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              AI tools are ready to help you grow{" "}
            </motion.p>
            <svg
              width="140"
              height="145"
              viewBox="0 0 192 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.0955 126.001H27.1607L20.4709 145H4.54908L37.8644 51.8776H55.5256L88.8409 145H72.7853L66.0955 126.001ZM61.814 113.558L46.695 70.3415L31.4422 113.558H61.814ZM118.579 52.0114V145H103.326V52.0114H118.579Z"
                fill="black"
              />
              <path
                d="M176.448 8.15214L182.469 18.8559L164.139 25.6795L182.469 32.5031L176.314 43.4744L161.062 31.4327L163.871 50.8332H151.562L154.104 31.4327L138.851 43.742L132.429 32.3693L150.626 25.5457L132.429 18.9897L138.584 8.01834L154.238 20.06L151.562 0.525728H164.005L161.062 20.06L176.448 8.15214Z"
                fill="black"
              />
            </svg>
          </motion.article>
        </div>
        <div className={styles.wrapper_linechart}>
          <p className={styles.text_linechart}>
            Analyze and develop <br />
            better products
          </p>
          <LineChart
            className={styles.linechart}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            max-width={800}
            height={200}
          />
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
