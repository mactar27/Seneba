import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
// Only initialize on the client
export const getPusherClient = () => {
  if (typeof window === "undefined") return null;
  
  // Return existing instance if already initialized to prevent multiple connections
  if ((window as any).pusherClientInstance) {
    return (window as any).pusherClientInstance as PusherClient;
  }

  const client = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });
  
  (window as any).pusherClientInstance = client;
  return client;
};
