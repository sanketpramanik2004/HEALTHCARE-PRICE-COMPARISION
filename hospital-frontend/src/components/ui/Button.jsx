import { motion } from "framer-motion";

const variants = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  secondary: "bg-cream-200 text-amber-900 hover:bg-cream-300",
  ghost: "bg-white/70 text-slate-700 border border-slate-200 hover:bg-white",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`min-h-[42px] rounded-xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
