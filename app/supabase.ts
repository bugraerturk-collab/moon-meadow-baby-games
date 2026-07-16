import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key
  ? createClient(url, key, { auth: { persistSession: false } })
  : null;

export type SavedResponse = {
  id?: string;
  room_code: string;
  player_name: string;
  game_id: string;
  question_index: number;
  question_prompt: string;
  answer: string;
  is_correct: boolean | null;
  points: number;
};
