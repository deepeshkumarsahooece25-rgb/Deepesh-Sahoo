import { useAuth } from "@/src/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { LogOut, User, Bell, Shield, Smartphone } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

      <Card className="shadow-sm border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-100 to-blue-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border-4 border-white">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-800">{user?.displayName || "Parent"}</h3>
          <p className="text-slate-500 text-sm">{user?.email}</p>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-0 divide-y divide-slate-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Device Connection</span>
              </div>
              <span className="text-sm text-emerald-500 font-medium bg-emerald-50 px-2 py-1 rounded-md">Connected</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Notifications</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Privacy & Security</span>
              </div>
            </button>
          </CardContent>
        </Card>

        <Button 
          onClick={logout} 
          variant="destructive" 
          className="w-full rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-0 shadow-sm"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
