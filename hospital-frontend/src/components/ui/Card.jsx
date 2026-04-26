import { motion } from "framer-motion";

export default function Card({ className = "", children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      whileHover={{ y: -2 }}
      className={`glass-card p-5 ${className}`}
    >
      {children}
    </motion.section>
  );
}
