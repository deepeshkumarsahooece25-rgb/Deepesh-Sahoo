import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Baby, Wifi } from "lucide-react";

export default function Login() {
  const { loginWithDevice } = useAuth();
  const [deviceId, setDeviceId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId || !password) {
      setError("Device ID and Password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await loginWithDevice(deviceId, password, name);
    } catch (err: any) {
      setError(err.message || "Failed to connect to device");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Baby className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">SmartBaby</h1>
        <p className="text-slate-500 mb-8">Connect to your ESP32 Baby Swing</p>
        
        <form onSubmit={handleConnect} className="w-full space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-700">Device ID / ESP32 IP Address</label>
            <Input 
              placeholder="e.g. 192.168.1.25" 
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="bg-white rounded-xl"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-700">Parent Password</label>
            <Input 
              type="password"
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white rounded-xl"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-700">Parent Name <span className="text-slate-400 font-normal">(optional)</span></label>
            <Input 
              placeholder="e.g. Mom or Dad" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white rounded-xl"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button 
            type="submit"
            size="lg" 
            disabled={loading}
            className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 text-white shadow-md mt-4"
          >
            {loading ? "Connecting..." : (
              <>
                <Wifi className="w-5 h-5 mr-2" />
                Connect
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
