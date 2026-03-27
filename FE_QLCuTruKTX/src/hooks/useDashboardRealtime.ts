import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export function useDashboardRealtime(onUpdate: (data: any) => void) {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5160/hubs/dashboard")
      .withAutomaticReconnect()
      .build();

    connection.on("DashboardUpdated", (data) => {
      console.log("📡 Realtime Dashboard Update:", data);
      onUpdate(data);
    });

    // Start connection (async nhưng không return Promise)
    connection
      .start()
      .then(() => console.log("✔ Dashboard realtime connected"))
      .catch((err) => console.error("SignalR Error:", err));

    // Cleanup — return 1 function sync, không phải async
    return () => {
      console.log("❌ Stop dashboard realtime");
      connection.stop();
    };
  }, []);
}
