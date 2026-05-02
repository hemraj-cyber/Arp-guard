import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, formatApiError } from "../App";
import { ShieldAlert } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
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
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-white">Initialize Credentials</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have clearance? <Link to="/login" className="font-medium text-primary hover:text-primary/80">Authenticate here</Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-3 bg-destructive/20 border border-destructive text-destructive text-sm" data-testid="register-error">{error}</div>}
                
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Operative Name</label>
                  <div className="mt-1">
                    <input
                      data-testid="register-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full appearance-none rounded-none border border-border bg-background px-3 py-2 text-white placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Email Address</label>
                  <div className="mt-1">
                    <input
                      data-testid="register-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-none border border-border bg-background px-3 py-2 text-white placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Secure Password</label>
                  <div className="mt-1">
                    <input
                      data-testid="register-password-input"
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
                    data-testid="register-submit-button"
                    type="submit"
                    className="flex w-full justify-center rounded-none border border-transparent bg-primary py-2 px-4 text-xs font-bold tracking-[0.1em] uppercase text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Establish Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-20 blend-screen"
          src="https://images.unsplash.com/photo-1683447551794-1c287cd42675?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxuZXR3b3JrJTIwbm9kZXMlMjBkYXJrfGVufDB8fHx8MTc3NTg0OTgxMnww&ixlib=rb-4.1.0&q=85"
          alt="Network nodes"
        />
        <div className="absolute inset-0 bg-black/80 blend-overlay" />
      </div>
    </div>
  );
}
