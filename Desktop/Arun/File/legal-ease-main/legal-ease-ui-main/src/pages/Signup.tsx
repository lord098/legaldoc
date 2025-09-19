import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Mail, Lock, User, ArrowRight } from "lucide-react";
import AuthBackground from "../components/AuthBackground";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name, // The backend expects 'username'
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(data.message);
        // After successful signup, you might want to redirect the user
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after a short delay
      } else {
        setError(data.message || 'An error occurred during signup.');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { id: "name", label: "Full Name", type: "text", icon: User, placeholder: "Enter your full name" },
    { id: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "Enter your email" },
    { id: "password", label: "Password", type: "password", icon: Lock, placeholder: "Create a password" },
    { id: "confirmPassword", label: "Confirm Password", type: "password", icon: Lock, placeholder: "Confirm your password" }
  ];

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md mx-auto px-6"
      >
        <Card className="glass-card border-white/30 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-fit p-3 bg-primary rounded-2xl"
            >
              <Scale className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold text-black">Create Account</CardTitle>
              <CardDescription className="text-black/80 mt-2">
                Join LegalAI and demystify legal documents
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-sm"
              >
                {successMessage}
              </motion.div>
            )}
            <motion.form
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor={field.id} className="text-black/90 font-medium">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
                    <Input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="pl-10 bg-white/20 border-white/30 text-black placeholder:text-black/60 focus:border-white/50 focus:ring-white/20"
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mt-6"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white/30 border-t-black rounded-full"
                    />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 text-center"
            >
              <p className="text-black/80">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-accent font-semibold hover:text-accent/90 transition-colors underline decoration-accent/50 hover:decoration-accent"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthBackground>
  );
};

export default Signup;
