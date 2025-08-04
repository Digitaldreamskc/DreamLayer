import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client with your project URL and anon key
// In production, these should be loaded from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if a table exists, and create it if it doesn't
export async function ensureIpAssetsTableExists() {
  try {
    // Check if the ip_assets table already exists
    const { data: tableExists, error: checkError } = await supabase
      .from('ip_assets')
      .select('id')
      .limit(1)
      .maybeSingle()
    
    // If we get an error about the table not existing, create it
    if (checkError && checkError.message.includes('relation "ip_assets" does not exist')) {
      console.log('Creating ip_assets table in Supabase...')
      // Note: In practice, you'd typically use migrations rather than programmatic creation
      // This is just a simplified approach for a hackathon
      const { error: createError } = await supabase.rpc('create_ip_assets_table')
      
      if (createError) {
        console.error('Failed to create ip_assets table:', createError)
      } else {
        console.log('ip_assets table created successfully')
      }
    }
    
    return true
  } catch (error) {
    console.error('Error checking/creating ip_assets table:', error)
    return false
  }
}

// Initialize the table when the app starts
if (typeof window !== 'undefined') {
  // Only run in browser context
  ensureIpAssetsTableExists().catch(console.error)
}
