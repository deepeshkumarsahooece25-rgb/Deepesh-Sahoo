import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Activity, Moon, MapPin, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Activity, label: "Activity", path: "/activity" },
    { icon: Moon, label: "Sleep", path: "/sleep" },
    { icon: MapPin, label: "Doctor", path: "/doctor" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
  ];

  return (
    <div className="flex flex-col h-screen bg-pink-50/30 font-sans text-slate-800">
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-pink-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-blue-300 flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            SmartBaby
          </h1>
        </div>
        <Link to="/settings" className="p-2 rounded-full hover:bg-pink-100 text-slate-500 transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 px-6 py-3 flex justify-between items-center pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300",
                isActive ? "text-blue-500" : "text-slate-400 hover:text-pink-400"
              )}
            >
              <div className={cn("p-1.5 rounded-xl transition-colors", isActive && "bg-blue-50")}>
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
