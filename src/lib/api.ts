import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key-here';

export const supabase = isSupabaseConfigured ? 
  createClient(supabaseUrl!, supabaseKey!) : 
  null;

// Events API
export const eventsApi = {
  async getAll() {
    if (!supabase) {
      // Return mock data when Supabase is not configured
      return [];
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async checkIn(eventId: string, userId: string) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot check in to event');
      return null;
    }
    
    const { data, error } = await supabase
      .from('event_checkins')
      .insert([{ event_id: eventId, user_id: userId }]);
    
    if (error) throw error;
    return data;
  }
};

// Vision/IP Assets API
export const visionApi = {
  async getAll() {
    if (!supabase) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('ip_assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('ip_assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(asset: any) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot create IP asset');
      return null;
    }
    
    const { data, error } = await supabase
      .from('ip_assets')
      .insert([asset]);
    
    if (error) throw error;
    return data;
  }
};

// DYOR/Quests API
export const dyorApi = {
  async getAll() {
    if (!supabase) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('difficulty', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!supabase) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProgress(questId: string, userId: string, progress: number) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot update quest progress');
      return null;
    }
    
    const { data, error } = await supabase
      .from('quest_progress')
      .upsert([{ 
        quest_id: questId, 
        user_id: userId, 
        progress 
      }]);
    
    if (error) throw error;
    return data;
  }
};
