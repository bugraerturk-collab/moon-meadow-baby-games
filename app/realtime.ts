import { createClient } from "@supabase/supabase-js";

export type RoomEvent = { type: string; room: string; payload?: unknown };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

export function roomChannel(room: string, onEvent: (event: RoomEvent) => void) {
  if (typeof window === "undefined") return { send: () => {}, close: () => {} };
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(`moon-meadow-${room}`) : null;
  if (channel) channel.onmessage = (e) => onEvent(e.data as RoomEvent);
  const remoteChannel = supabase
    ?.channel(`moon-meadow-${room}`, { config: { broadcast: { self: false } } })
    .on("broadcast", { event: "room-event" }, ({ payload }) => onEvent(payload as RoomEvent))
    .subscribe();
  const storageHandler = (e: StorageEvent) => {
    if (e.key === `mm-event-${room}` && e.newValue) onEvent(JSON.parse(e.newValue));
  };
  window.addEventListener("storage", storageHandler);
  return {
    send(type: string, payload?: unknown) {
      const event = { type, room, payload, at: Date.now() };
      channel?.postMessage(event);
      localStorage.setItem(`mm-event-${room}`, JSON.stringify(event));
      void remoteChannel?.send({ type: "broadcast", event: "room-event", payload: event });
    },
    close() {
      channel?.close();
      if (remoteChannel && supabase) void supabase.removeChannel(remoteChannel);
      window.removeEventListener("storage", storageHandler);
    },
  };
}
