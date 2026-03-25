import { useDevice } from "@/src/hooks/useDevice";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Thermometer, Droplets, Music, Power, Moon, Video, Mic, Activity, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { device, updateDevice } = useDevice();

  if (!device) return <div className="p-4 text-center text-slate-500">Connecting to swing...</div>;

  const isWet = device.moisture > 60;

  return (
    <div className="space-y-6">
      {/* Camera View */}
      <Card className="overflow-hidden border-0 shadow-lg bg-slate-900 relative">
        <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
          <img 
            src={`https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80${device.isNightMode ? '&sat=-100&bri=-20' : ''}`}
            alt="Baby Camera"
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/40 text-white border-0 backdrop-blur-md rounded-full">
              <Mic className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className={cn("border-0 backdrop-blur-md rounded-full", device.isNightMode ? "bg-blue-500 text-white" : "bg-white/20 hover:bg-white/40 text-white")}
              onClick={() => updateDevice({ isNightMode: !device.isNightMode })}
            >
              <Moon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Sensor Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Room Temp</p>
              <p className="text-2xl font-bold text-slate-800">{device.temperature}°C</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn("border shadow-sm transition-colors", isWet ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", isWet ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500")}>
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Diaper</p>
              <p className={cn("text-lg font-bold", isWet ? "text-blue-700" : "text-slate-800")}>
                {isWet ? "Needs Change" : "Dry"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Alert */}
      <Button 
        variant="destructive" 
        className="w-full h-14 rounded-2xl text-lg font-bold shadow-md animate-pulse bg-red-500 hover:bg-red-600"
        onClick={() => alert("Emergency Alert Sent to all registered contacts!")}
      >
        <Activity className="w-6 h-6 mr-2" />
        EMERGENCY ALERT
      </Button>

      {/* Magic Lullaby Link */}
      <Link to="/magic" className="block">
        <Card className="shadow-sm border-slate-100 bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold">Magic Lullaby</p>
                <p className="text-sm text-white/80">Create AI visuals & videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Swing Controls */}
      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Swing Control</span>
            <div className="flex items-center gap-2 text-sm font-normal text-slate-500">
              <span>Auto-Swing</span>
              <button 
                className={cn("w-12 h-6 rounded-full transition-colors relative", device.isAutoSwing ? "bg-blue-500" : "bg-slate-200")}
                onClick={() => updateDevice({ isAutoSwing: !device.isAutoSwing })}
              >
                <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm", device.isAutoSwing ? "translate-x-6" : "translate-x-0.5")} />
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2 bg-slate-50 p-1.5 rounded-2xl">
            {["off", "slow", "medium", "fast"].map((speed) => (
              <button
                key={speed}
                onClick={() => updateDevice({ swingSpeed: speed as any })}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
                  device.swingSpeed === speed 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {speed}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lullaby */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl transition-colors", device.currentLullaby ? "bg-pink-100 text-pink-600" : "bg-slate-100 text-slate-500")}>
              <Music className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Lullaby</p>
              <p className="text-base font-semibold text-slate-800">
                {device.currentLullaby || "Not playing"}
              </p>
            </div>
          </div>
          <Button 
            variant={device.currentLullaby ? "secondary" : "outline"}
            className="rounded-xl"
            onClick={() => updateDevice({ currentLullaby: device.currentLullaby ? "" : "Twinkle Twinkle" })}
          >
            {device.currentLullaby ? "Stop" : "Play"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
