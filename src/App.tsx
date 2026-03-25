/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/src/hooks/useAuth";
import Layout from "@/src/components/Layout";
import Dashboard from "@/src/pages/Dashboard";
import ActivityLog from "@/src/pages/ActivityLog";
import SleepMonitor from "@/src/pages/SleepMonitor";
import DoctorLocator from "@/src/pages/DoctorLocator";
import Chatbot from "@/src/pages/Chatbot";
import Settings from "@/src/pages/Settings";
import Login from "@/src/pages/Login";
import MagicLullaby from "@/src/pages/MagicLullaby";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-pink-50">
        <div className="w-12 h-12 border-4 border-pink-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="sleep" element={<SleepMonitor />} />
          <Route path="doctor" element={<DoctorLocator />} />
          <Route path="chat" element={<Chatbot />} />
          <Route path="magic" element={<MagicLullaby />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
