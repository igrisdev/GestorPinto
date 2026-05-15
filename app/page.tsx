"use client";

import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import type { User } from "@/types/user";
import type { Resource } from "@/types/resource";

export default function RecursosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  const handleLoginSuccess = (loggedUser: User, userResources: Resource[]) => {
    setUser(loggedUser);
    setResources(userResources);
  };

  const handleLogout = () => {
    setUser(null);
    setResources([]);
  };

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Dashboard user={user} resources={resources} onLogout={handleLogout} />
  );
}
