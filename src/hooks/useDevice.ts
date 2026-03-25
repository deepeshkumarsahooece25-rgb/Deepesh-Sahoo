import { useState, useEffect } from "react";
import { db, auth } from "@/src/firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export interface DeviceStatus {
  userId: string;
  temperature: number;
  moisture: number;
  swingSpeed: "off" | "slow" | "medium" | "fast";
  isAutoSwing: boolean;
  isNightMode: boolean;
  currentLullaby: string;
  updatedAt: string;
}

export function useDevice() {
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const deviceRef = doc(db, "devices", user.uid);
    
    const unsubscribe = onSnapshot(deviceRef, async (snap) => {
      if (!snap.exists()) {
        const initialDevice: DeviceStatus = {
          userId: user.uid,
          temperature: 24.5,
          moisture: 10,
          swingSpeed: "off",
          isAutoSwing: false,
          isNightMode: false,
          currentLullaby: "",
          updatedAt: new Date().toISOString()
        };
        await setDoc(deviceRef, initialDevice);
        setDevice(initialDevice);
      } else {
        setDevice(snap.data() as DeviceStatus);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateDevice = async (updates: Partial<DeviceStatus>) => {
    const user = auth.currentUser;
    if (!user) return;
    const deviceRef = doc(db, "devices", user.uid);
    await updateDoc(deviceRef, { ...updates, updatedAt: new Date().toISOString() });
  };

  return { device, loading, updateDevice };
}
