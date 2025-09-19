import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Home, Upload, History, Scale } from "lucide-react";

const Sidebar = () => {
  const sidebarItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/history", label: "History", icon: History },
  ];

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-card/95 backdrop-blur-lg border-r border-border/50 min-h-screen"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">LegalAI</h2>
            <p className="text-xs text-muted-foreground">Chat Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;