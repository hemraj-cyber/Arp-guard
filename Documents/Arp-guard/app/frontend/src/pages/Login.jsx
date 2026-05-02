import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, formatApiError } from "../App";
import { ShieldAlert } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center space-x-2 text-primary">
              <ShieldAlert className="h-8 w-8" />
              <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">ARP GUARD</h2>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-white">Sign in to Control Room</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Or <Link to="/register" className="font-medium text-primary hover:text-primary/80">request access authorization</Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-3 bg-destructive/20 border border-destructive text-destructive text-sm" data-testid="login-error">{error}</div>}
                
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Email Address</label>
                  <div className="mt-1">
                    <input
                      data-testid="login-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-none border border-border bg-background px-3 py-2 text-white placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Password</label>
                  <div className="mt-1">
                    <input
                      data-testid="login-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-none border border-border bg-background px-3 py-2 text-white placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    data-testid="login-submit-button"
                    type="submit"
                    className="flex w-full justify-center rounded-none border border-transparent bg-primary py-2 px-4 text-xs font-bold tracking-[0.1em] uppercase text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Authenticate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-30 blend-screen"
          src="https://images.unsplash.com/photo-1680691257251-5fead813b73e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxzZXJ2ZXIlMjByYWNrJTIwZGFya3xlbnwwfHx8fDE3NzU4NDk4MTF8MA&ixlib=rb-4.1.0&q=85"
          alt="Server rack"
        />
        <div className="absolute inset-0 bg-black/60 blend-overlay" />
      </div>
    </div>
  );
}
