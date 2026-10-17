export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Generated-shape types for the Finish Music table used by this app. */
export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.17' };
  public: {
    Tables: {
      tracks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          meta: string | null;
          release_date: string | null;
          stage: number;
          stage_tasks: Json;
          todos: Json;
          notes: string;
          timestamp_notes: Json;
          arrangement_version: string;
          mix_version: string;
          mastered_version: string;
          track_type: string | null;
          release_type: string | null;
          bpm: number | null;
          musical_key: string;
          genre: string;
          audio_path: string | null;
          audio_name: string | null;
          art_path: string | null;
          art_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title: string;
          meta?: string | null;
          release_date?: string | null;
          stage?: number;
          stage_tasks?: Json;
          todos?: Json;
          notes?: string;
          timestamp_notes?: Json;
          arrangement_version?: string;
          mix_version?: string;
          mastered_version?: string;
          track_type?: string | null;
          release_type?: string | null;
          bpm?: number | null;
          musical_key?: string;
          genre?: string;
          audio_path?: string | null;
          audio_name?: string | null;
          art_path?: string | null;
          art_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          meta?: string | null;
          release_date?: string | null;
          stage?: number;
          stage_tasks?: Json;
          todos?: Json;
          notes?: string;
          timestamp_notes?: Json;
          arrangement_version?: string;
          mix_version?: string;
          mastered_version?: string;
          track_type?: string | null;
          release_type?: string | null;
          bpm?: number | null;
          musical_key?: string;
          genre?: string;
          audio_path?: string | null;
          audio_name?: string | null;
          art_path?: string | null;
          art_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
