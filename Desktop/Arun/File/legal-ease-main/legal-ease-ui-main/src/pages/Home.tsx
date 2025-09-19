import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MessageSquare, History, FileText, Zap, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Securely upload legal documents for instant analysis",
      link: "/upload",
      color: "bg-blue-500/20 text-blue-600 border-blue-200"
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Ask questions and get instant explanations",
      link: "/chat",
      color: "bg-purple-500/20 text-purple-600 border-purple-200"
    },
    {
      icon: History,
      title: "Document History",
      description: "Access your previously analyzed documents",
      link: "/history",
      color: "bg-green-500/20 text-green-600 border-green-200"
    }
  ];

  const benefits = [
    { icon: FileText, title: "Simple Analysis", description: "Transform complex legal jargon into plain English" },
    { icon: Zap, title: "Instant Results", description: "Get explanations in seconds, not hours" },
    { icon: Shield, title: "Secure & Private", description: "Your documents are encrypted and protected" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background using uploaded home gradient image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/lovable-uploads/451d39b9-8568-4b81-b2e5-8b84329cff50.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/10" />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Legal Documents
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                Made Simple
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Transform complex legal documents into clear, understandable language with our AI-powered assistant
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-glow"
              >
                <Link to="/upload">
                  Get Started Now
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300 group h-full">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`mx-auto w-fit p-4 rounded-2xl ${feature.color} border-2 backdrop-blur-sm bg-opacity-90`}
                    >
                      <feature.icon className="h-8 w-8 relative z-10" />
                    </motion.div>
                    <CardTitle className="text-white text-xl font-bold group-hover:text-accent transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-white mb-4 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/30 text-gray-600 hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <Link to={feature.link}>
                        Explore
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose LegalAI?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.8 + index * 0.15, duration: 0.5 }}
                  className="glass-card border-white/20 p-6 hover:scale-105 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto w-fit p-3 bg-white/20 rounded-full mb-4"
                  >
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </motion.div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Home;