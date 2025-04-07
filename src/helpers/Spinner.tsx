import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <motion.div
      className="absolute inset-0 flex justify-center items-center w-full h-full bg-blue/50 backdrop-blur-xl z-19"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
    </motion.div>
  );
}

