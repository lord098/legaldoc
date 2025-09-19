import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Scale } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen subtle-gradient flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-white/5 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-md mx-auto px-6"
      >
        <Card className="glass-card border-white/20 shadow-2xl">
          <CardContent className="p-12">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-fit p-4 bg-primary/20 rounded-2xl mb-6"
            >
              <Scale className="h-12 w-12 text-primary" />
            </motion.div>

            {/* 404 Number */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-6xl font-bold text-primary mb-4"
            >
              404
            </motion.h1>

            {/* Error Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
              <p className="text-muted-foreground leading-relaxed">
                Oops! The page you're looking for seems to have gone missing. 
                Let's get you back to analyzing legal documents.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 group"
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Back to Home
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="border-border hover:bg-muted transition-all duration-300 hover:scale-105 group"
                onClick={() => window.history.back()}
              >
                <button>
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </button>
              </Button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-8 pt-6 border-t border-border/30"
            >
              <p className="text-sm text-muted-foreground mb-3">Quick Links:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  to="/upload"
                  className="text-sm text-accent hover:text-accent/80 transition-colors underline decoration-accent/50 hover:decoration-accent"
                >
                  Upload Document
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  to="/chat"
                  className="text-sm text-accent hover:text-accent/80 transition-colors underline decoration-accent/50 hover:decoration-accent"
                >
                  AI Chat
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  to="/history"
                  className="text-sm text-accent hover:text-accent/80 transition-colors underline decoration-accent/50 hover:decoration-accent"
                >
                  View History
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
