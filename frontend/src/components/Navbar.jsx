import React, { useContext } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome,
  FiMusic,
  FiUpload,
  FiList,
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiLogOut
} from 'react-icons/fi';
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu(!showMenu);
  const logOut = () => {
    localStorage.removeItem("access_token");
    navigate("/");
    setShowMenu(false);
  };

  // Animation variants
  const menuVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    closed: { 
      x: "100%", 
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const navItemVariants = {
    hover: { 
      scale: 1.05, 
      color: "#fbbf24",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  const mobileItemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 }
    },
    closed: { x: 50, opacity: 0 }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div 
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-bold flex items-center">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <FiMusic className="text-yellow-400 mr-2" size={28} />
              </motion.span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                Stock Music
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { path: "/", icon: <FiHome size={20} />, text: "Home" },
              { path: "/explore", icon: <FiMusic size={20} />, text: "Songs" },
              // { path: "/upload", icon: <FiUpload size={20} />, text: "Upload" },
              { path: "/playlists", icon: <FiList size={20} />, text: "Playlists" }
            ].map((item) => (
              <motion.div 
                key={item.path}
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link 
                  to={item.path} 
                  className="flex items-center space-x-2 relative group"
                >
                  {item.icon}
                  <span>{item.text}</span>
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {token ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  onClick={logOut}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-full transition-colors duration-200"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    <FiLogIn size={18} />
                    <span>Login</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    <span>Sign Up</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle Menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMenu size={25} />
          </motion.button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden"
            />
            
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="lg:hidden fixed inset-y-0 right-0 w-64 bg-gray-900 shadow-xl z-50 p-6 pt-20"
            >
              <div className="flex flex-col space-y-6">
                {[
                  { path: "/", icon: <FiHome size={22} />, text: "Home" },
                  { path: "/explore", icon: <FiMusic size={22} />, text: "Songs" },
                  { path: "/upload", icon: <FiUpload size={22} />, text: "Upload" },
                  { path: "/playlists", icon: <FiList size={22} />, text: "Playlists" }
                ].map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={mobileItemVariants}
                    custom={index}
                  >
                    <Link 
                      to={item.path} 
                      className="flex items-center space-x-4 text-lg p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={toggleMenu}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-gray-800 pt-4 mt-2">
                  {token ? (
                    <motion.button
                      onClick={() => { logOut(); toggleMenu(); }}
                      className="flex items-center justify-center space-x-2 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-3 rounded-full transition-colors duration-200"
                      variants={mobileItemVariants}
                      custom={4}
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </motion.button>
                  ) : (
                    <>
                      <motion.div variants={mobileItemVariants} custom={4}>
                        <Link
                          to="/login"
                          onClick={toggleMenu}
                          className="flex items-center justify-center space-x-2 w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-full transition-colors duration-200 mb-3"
                        >
                          <FiLogIn size={18} />
                          <span>Login</span>
                        </Link>
                      </motion.div>
                      <motion.div variants={mobileItemVariants} custom={5}>
                        <Link
                          to="/register"
                          onClick={toggleMenu}
                          className="flex items-center justify-center space-x-2 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-3 rounded-full transition-colors duration-200"
                        >
                          <span>Sign Up</span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                <motion.button
                  onClick={toggleMenu}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  variants={mobileItemVariants}
                  custom={6}
                >
                  <FiX size={24} />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;