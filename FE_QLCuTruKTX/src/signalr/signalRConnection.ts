// src/signalr/signalRConnection.ts
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function getHubConnection() {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7122/hubs/chat", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();
  }
  return connection;
}

export async function startHub() {
  const conn = getHubConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start();
  }
}

export async function stopHub() {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
}
