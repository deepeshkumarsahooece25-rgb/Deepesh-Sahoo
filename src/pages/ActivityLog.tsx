import { useState, useEffect } from "react";
import { db, auth } from "@/src/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { Baby, Droplets, Moon, HeartPulse, Utensils, Plus, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface ActivityLog {
  id: string;
  userId: string;
  type: "feeding" | "crying" | "sleep" | "diaper" | "health";
  timestamp: string;
  notes?: string;
  durationMinutes?: number;
}

const ICONS = {
  feeding: Utensils,
  crying: Baby,
  sleep: Moon,
  diaper: Droplets,
  health: HeartPulse,
};

const COLORS = {
  feeding: "bg-orange-100 text-orange-600",
  crying: "bg-red-100 text-red-600",
  sleep: "bg-indigo-100 text-indigo-600",
  diaper: "bg-blue-100 text-blue-600",
  health: "bg-emerald-100 text-emerald-600",
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "activities"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
      setActivities(data);
      setLoading(false);
    }, (error) => {
      console.error("ActivityLog onSnapshot error:", error);
    });

    return unsubscribe;
  }, []);

  const handleAdd = async (type: ActivityLog["type"]) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "activities"), {
      userId: user.uid,
      type,
      timestamp: new Date().toISOString(),
      notes: `Logged ${type}`
    });
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "activities", id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Activity Log</h2>
        <Button onClick={() => setShowAdd(!showAdd)} size="icon" className="rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-md">
          <Plus className={cn("w-6 h-6 transition-transform", showAdd && "rotate-45")} />
        </Button>
      </div>

      {showAdd && (
        <Card className="border-pink-100 shadow-sm animate-in slide-in-from-top-4 fade-in">
          <CardContent className="p-4 grid grid-cols-5 gap-2">
            {(Object.keys(ICONS) as Array<ActivityLog["type"]>).map((type) => {
              const Icon = ICONS[type];
              return (
                <button
                  key={type}
                  onClick={() => handleAdd(type)}
                  className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className={cn("p-3 rounded-full", COLORS[type])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 capitalize">{type}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {loading ? (
          <div className="text-center text-slate-500 py-8">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No activities logged yet.</div>
        ) : (
          activities.map((activity) => {
            const Icon = ICONS[activity.type];
            return (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={cn("flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10", COLORS[activity.type])}>
                  <Icon className="w-5 h-5" />
                </div>
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 shadow-sm border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800 capitalize">{activity.type}</h4>
                    <time className="text-xs text-slate-400 font-medium">{format(new Date(activity.timestamp), "h:mm a")}</time>
                  </div>
                  {activity.notes && <p className="text-sm text-slate-500">{activity.notes}</p>}
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
