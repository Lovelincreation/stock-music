import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarContext } from "../Context/SibebarContext";
import bg from "../assets/bg4.jpg";
import '../utils/style.css';
import { Link } from "react-router-dom";

const Home = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(null);
  
  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  const token = localStorage.getItem("access_token") || null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)"
    },
    tap: { scale: 0.95 }
  };

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center flex-col relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-center items-center space-y-8 w-full h-screen px-4 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl text-white font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-emerald-400"
          >
            Stock Music
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Discover, upload, and stream your favorite music in high quality
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6"
          >
            {token ? (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onHoverStart={() => setIsHovered('upload')}
                onHoverEnd={() => setIsHovered(null)}
              >
                <Link 
                  to="/upload" 
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center 
                    ${isHovered === 'upload' ? 
                      'bg-emerald-400 text-gray-900 shadow-lg' : 
                      'bg-lime-300 text-[#461e74]'}`}
                >
                  Upload Music
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onHoverStart={() => setIsHovered('login')}
                onHoverEnd={() => setIsHovered(null)}
              >
                <Link 
                  to="/login" 
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center 
                    ${isHovered === 'login' ? 
                      'bg-emerald-400 text-gray-900 shadow-lg' : 
                      'bg-lime-300 text-[#461e74]'}`}
                >
                  Get Started
                </Link>
              </motion.div>
            )}
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onHoverStart={() => setIsHovered('explore')}
              onHoverEnd={() => setIsHovered(null)}
            >
              <Link 
                to="/explore" 
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center 
                  ${isHovered === 'explore' ? 
                    'bg-white text-gray-900 shadow-lg' : 
                    'bg-transparent border-2 border-lime-300 text-white'}`}
              >
                Explore Music
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating music notes decoration */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white opacity-70">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;