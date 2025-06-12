-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  max_attendees INTEGER NOT NULL,
  secret_code TEXT,
  poap_image_url TEXT,
  gradient TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_checkins table
CREATE TABLE event_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create ip_assets table
CREATE TABLE ip_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quests table
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  reward_amount DECIMAL(20, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quest_progress table
CREATE TABLE quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quest_id, user_id)
);

-- Create RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Events can be created by authenticated users" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Event checkins policies
CREATE POLICY "Checkins are viewable by everyone" ON event_checkins
  FOR SELECT USING (true);

CREATE POLICY "Users can check in to events" ON event_checkins
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- IP Assets policies
CREATE POLICY "IP Assets are viewable by everyone" ON ip_assets
  FOR SELECT USING (true);

CREATE POLICY "IP Assets can be created by authenticated users" ON ip_assets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Quests policies
CREATE POLICY "Quests are viewable by everyone" ON quests
  FOR SELECT USING (true);

CREATE POLICY "Quests can be created by authenticated users" ON quests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Quest progress policies
CREATE POLICY "Quest progress is viewable by everyone" ON quest_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own quest progress" ON quest_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_assets_updated_at
  BEFORE UPDATE ON ip_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quest_progress_updated_at
  BEFORE UPDATE ON quest_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 