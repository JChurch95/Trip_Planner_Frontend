import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const DirectionalTransition = ({ children }) => {
  const location = useLocation();
  
  // Map your nav items to numerical values for direction calculation
  const pathValues = {
    '/': 0,
    '/plan-trip': 2,
    '/my-trips': 3,
    '/profile': 1     // Made this significantly lower
  };

  const prevPath = localStorage.getItem('currentPath');
  const currentPath = location.pathname;
  
  // Calculate direction based on path values instead of string comparison
  const direction = prevPath === '/profile' || currentPath === '/profile'
    ? (pathValues[prevPath] < pathValues[currentPath] ? -1 : 1)
    : (pathValues[prevPath] < pathValues[currentPath] ? 1 : -1);
  
  localStorage.setItem('currentPath', currentPath);

  const slideVariants = {
    initial: { 
      x: direction * 500,
      opacity: 0 
    },
    animate: { 
      x: 0,
      opacity: 1 
    },
    exit: { 
      x: direction * -500,
      opacity: 0 
    }
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      style={{
        width: '100%',
        position: 'relative'
      }}
    >
      {children}
    </motion.div>
  );
};

export default DirectionalTransition;