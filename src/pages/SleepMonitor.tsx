import { useState, useEffect } from "react";
import { db, auth } from "@/src/firebase";
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays } from "date-fns";
import { Moon, Sun } from "lucide-react";

interface SleepLog {
  id: string;
  date: string;
  lightSleepMinutes: number;
  deepSleepMinutes: number;
}

export default function SleepMonitor() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "sleep_logs"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      limit(7)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SleepLog)).reverse();
      
      // If no data, generate some mock data for the UI
      if (data.length === 0) {
        const mockData = Array.from({ length: 7 }).map((_, i) => ({
          id: `mock-${i}`,
          date: format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
          lightSleepMinutes: Math.floor(Math.random() * 180) + 120, // 2-5 hours
          deepSleepMinutes: Math.floor(Math.random() * 240) + 180, // 3-7 hours
        }));
        setLogs(mockData);
      } else {
        setLogs(data);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const totalSleepToday = logs.length > 0 
    ? logs[logs.length - 1].lightSleepMinutes + logs[logs.length - 1].deepSleepMinutes 
    : 0;
  
  const deepSleepToday = logs.length > 0 ? logs[logs.length - 1].deepSleepMinutes : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Sleep Analysis</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Moon className="w-5 h-5" />
              <span className="font-medium text-sm">Total Sleep</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {Math.floor(totalSleepToday / 60)}<span className="text-lg text-slate-500 font-medium">h</span> {totalSleepToday % 60}<span className="text-lg text-slate-500 font-medium">m</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <Sun className="w-5 h-5" />
              <span className="font-medium text-sm">Deep Sleep</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {Math.floor(deepSleepToday / 60)}<span className="text-lg text-slate-500 font-medium">h</span> {deepSleepToday % 60}<span className="text-lg text-slate-500 font-medium">m</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Sleep Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), "EEE")} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `${val / 60}h`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${Math.floor(value / 60)}h ${value % 60}m`, '']}
                  labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                />
                <Bar dataKey="deepSleepMinutes" name="Deep Sleep" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="lightSleepMinutes" name="Light Sleep" stackId="a" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Deep Sleep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-300" />
              <span>Light Sleep</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
