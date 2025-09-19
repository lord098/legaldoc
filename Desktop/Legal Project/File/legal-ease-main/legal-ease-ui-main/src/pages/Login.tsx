import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Mail, Lock, ArrowRight } from "lucide-react";
import AuthBackground from "@/components/AuthBackground";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                // After successful login, redirect the user
                setTimeout(() => {
                   navigate("/home", { replace: true });
                }, 1000);
            } else {
                setError(data.message || 'An error occurred during login.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Failed to connect to the server. Please check your network connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthBackground>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md mx-auto px-6"
            >
                <Card className="glass-card border-white/30 shadow-2xl">
                    <CardHeader className="space-y-4 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
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
                            <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
                            <CardDescription className="text-black/80 mt-2">
                                Sign in to your LegalAI account
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
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-black/90 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white/20 border-white/30 text-black placeholder:text-black/60 focus:border-black/50 focus:ring-white/20"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-black/90 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-white/20 border-white/30 text-black placeholder:text-black/60 focus:border-white/50 focus:ring-white/20"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="h-5 w-5 border-2 border-white/30 border-t-black rounded-full"
                                    />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </motion.form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-black/80">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-accent font-semibold hover:text-accent/90 transition-colors underline decoration-accent/50 hover:decoration-accent"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </AuthBackground>
    );
};

export default Login;