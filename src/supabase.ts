import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export type TrackRecord = Database['public']['Tables']['tracks']['Row'];
export type CloudClient = SupabaseClient<Database>;

export const isCloudConfigured = Boolean(url && publishableKey);
export const cloud: CloudClient | null = isCloudConfigured ? createClient<Database>(url!, publishableKey!) : null;
export type CloudUser = User;

export async function uploadAsset(
  client: CloudClient,
  bucket: 'track-audio' | 'track-art',
  path: string,
  file: File | Blob,
  contentType?: string,
): Promise<void> {
  const { error } = await client.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: contentType || (file instanceof File ? file.type : undefined),
  });
  if (error) throw error;
}

export async function downloadAsset(
  client: CloudClient,
  bucket: 'track-audio' | 'track-art',
  path: string,
): Promise<Blob> {
  const { data, error } = await client.storage.from(bucket).download(path);
  if (error) throw error;
  return data;
}

export async function removeAsset(
  client: CloudClient,
  bucket: 'track-audio' | 'track-art',
  path: string | undefined,
): Promise<void> {
  if (!path) return;
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
}
