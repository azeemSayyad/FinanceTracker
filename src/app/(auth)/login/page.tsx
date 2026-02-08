"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { loginAction } from "@/actions/auth-actions";
import { Loader2, Lock, Mail, ArrowRight, Eye, ReceiptIndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [state, action, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-background">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg relative z-10 px-6 flex flex-col items-center"
            >
                {/* Brand Logo Section */}
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(24,119,242,0.3)] mb-6"
                    >
                        <ReceiptIndianRupee className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-1">
                        ContractorPay
                    </h1>
                    <p className="text-muted-foreground font-medium opacity-60">
                        Premium Payment Management
                    </p>
                </div>

                {/* Main Card */}
                <div className="w-full bg-card/60 backdrop-blur-2xl border border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] p-4 md:p-14 relative group">
                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-extrabold text-foreground mb-3">
                                Welcome Back
                            </h2>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Sign in to manage your property<br />payments.
                            </p>
                        </div>

                        <form action={action} className="space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/80 ml-2">Email Address</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300">
                                            <Mail className="h-5 w-5 text-muted-foreground group-focus-within/input:text-primary" />
                                        </div>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            className="w-full bg-muted/40 border-none rounded-[1.5rem] pl-14 pr-5 py-5 text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/80 ml-2">Password</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300">
                                            <Lock className="h-5 w-5 text-muted-foreground group-focus-within/input:text-primary" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-muted/40 border-none rounded-[1.5rem] pl-14 pr-12 py-5 text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium"
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                            <Eye className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pr-2">
                                <button type="button" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity">
                                    Forgot Password?
                                </button>
                            </div>

                            {state?.error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-2 rounded-2xl flex items-center gap-3"
                                >
                                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                                    {state.error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isPending}
                                className={cn(
                                    "w-full bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold h-16 rounded-[1.5rem] shadow-[0_15px_30px_-5px_rgba(24,119,242,0.4)] flex items-center justify-center gap-3 group/btn transition-all duration-300 mt-4",
                                    isPending && "opacity-80 cursor-not-allowed"
                                )}
                            >
                                {isPending ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-lg">Sign In</span>
                                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-10 flex items-center justify-center gap-3 text-muted-foreground font-bold tracking-widest text-[10px] uppercase opacity-60">
                            <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center p-0.5">
                                <div className="h-full w-full bg-muted-foreground/30 rounded-full" />
                            </div>
                            Fast Login
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center gap-2 text-muted-foreground font-bold text-sm">
                    Don't have an account?
                    <button className="text-foreground hover:text-primary transition-colors">Sign Up</button>
                </div>
            </motion.div>
        </div>
    );
}
