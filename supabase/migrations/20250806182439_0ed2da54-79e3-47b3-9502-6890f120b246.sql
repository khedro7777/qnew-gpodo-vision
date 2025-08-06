
-- Create MCP Agent table
CREATE TABLE public.mcp_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    specialization TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group ID sequences for different gateway types
CREATE SEQUENCE IF NOT EXISTS purchasing_group_seq START 101;
CREATE SEQUENCE IF NOT EXISTS investment_group_seq START 201;
CREATE SEQUENCE IF NOT EXISTS marketing_group_seq START 301;
CREATE SEQUENCE IF NOT EXISTS formation_group_seq START 401;

-- Add group_number column to groups table
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS group_number TEXT UNIQUE;

-- Create function to generate group numbers based on gateway type
CREATE OR REPLACE FUNCTION generate_group_number(gateway_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    prefix CHAR(1);
    next_num INTEGER;
BEGIN
    CASE gateway_type
        WHEN 'purchasing' THEN
            prefix := 'P';
            next_num := nextval('purchasing_group_seq');
        WHEN 'investment' THEN
            prefix := 'I';
            next_num := nextval('investment_group_seq');
        WHEN 'marketing' THEN
            prefix := 'M';
            next_num := nextval('marketing_group_seq');
        WHEN 'formation' THEN
            prefix := 'F';
            next_num := nextval('formation_group_seq');
        ELSE
            prefix := 'G';
            next_num := 1000 + floor(random() * 9000);
    END CASE;
    
    RETURN prefix || ' ' || next_num::TEXT;
END;
$$;

-- Create trigger to auto-generate group numbers
CREATE OR REPLACE FUNCTION set_group_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.group_number IS NULL THEN
        NEW.group_number := generate_group_number(NEW.gateway_type::TEXT);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_group_number_trigger
    BEFORE INSERT ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION set_group_number();

-- Create group elections table
CREATE TABLE public.group_elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    election_type TEXT NOT NULL DEFAULT 'manager', -- manager, level_1, level_2, level_3, level_4
    status TEXT NOT NULL DEFAULT 'pending', -- pending, active, completed, cancelled
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_candidates INTEGER DEFAULT 4,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create election candidates table
CREATE TABLE public.election_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.group_elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level_position INTEGER, -- 1, 2, 3, 4
    vote_count INTEGER DEFAULT 0,
    campaign_message TEXT,
    nominated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create election votes table
CREATE TABLE public.election_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.group_elections(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.election_candidates(id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(election_id, voter_id)
);

-- Create MCP activities table for tracking all actions
CREATE TABLE public.mcp_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mcp_agent_id UUID REFERENCES public.mcp_agents(id),
    group_id UUID REFERENCES public.groups(id),
    activity_type TEXT NOT NULL, -- decision_created, vote_managed, offer_analyzed, election_arranged, etc.
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group performance reports table
CREATE TABLE public.group_performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    report_period TEXT NOT NULL, -- monthly, quarterly, yearly
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    member_satisfaction DECIMAL(3,2),
    completed_projects INTEGER DEFAULT 0,
    total_savings DECIMAL(15,2) DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    report_data JSONB,
    generated_by UUID REFERENCES public.mcp_agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create IPFS storage tracking table
CREATE TABLE public.ipfs_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id),
    file_hash TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    storage_purpose TEXT, -- decision_document, offer_attachment, election_material, etc.
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.mcp_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ipfs_storage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- MCP Agents policies
CREATE POLICY "MCP agents can view all records" ON public.mcp_agents FOR SELECT USING (true);
CREATE POLICY "Only admin can manage MCP agents" ON public.mcp_agents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Group elections policies
CREATE POLICY "Group members can view elections" ON public.group_elections FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = group_elections.group_id AND user_id = auth.uid())
);
CREATE POLICY "MCP agents can manage elections" ON public.group_elections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mcp_agents WHERE user_id = auth.uid() AND is_active = true)
);

-- Election candidates policies
CREATE POLICY "Members can view candidates" ON public.election_candidates FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.group_elections ge 
        JOIN public.group_members gm ON ge.group_id = gm.group_id 
        WHERE ge.id = election_candidates.election_id AND gm.user_id = auth.uid()
    )
);
CREATE POLICY "Members can nominate themselves" ON public.election_candidates FOR INSERT WITH CHECK (user_id = auth.uid());

-- Election votes policies
CREATE POLICY "Voters can view their votes" ON public.election_votes FOR SELECT USING (voter_id = auth.uid());
CREATE POLICY "Members can vote" ON public.election_votes FOR INSERT WITH CHECK (voter_id = auth.uid());

-- MCP activities policies
CREATE POLICY "MCP agents can manage activities" ON public.mcp_activities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mcp_agents WHERE user_id = auth.uid() AND is_active = true)
);

-- Performance reports policies
CREATE POLICY "Group members can view performance reports" ON public.group_performance_reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = group_performance_reports.group_id AND user_id = auth.uid())
);
CREATE POLICY "MCP agents can manage reports" ON public.group_performance_reports FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mcp_agents WHERE user_id = auth.uid() AND is_active = true)
);

-- IPFS storage policies
CREATE POLICY "Group members can view IPFS files" ON public.ipfs_storage FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = ipfs_storage.group_id AND user_id = auth.uid())
);
CREATE POLICY "Members can upload files" ON public.ipfs_storage FOR INSERT WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "MCP agents can manage all files" ON public.ipfs_storage FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mcp_agents WHERE user_id = auth.uid() AND is_active = true)
);

-- Insert sample MCP agent
INSERT INTO public.mcp_agents (user_id, agent_code, full_name, specialization) VALUES 
((SELECT id FROM auth.users LIMIT 1), 'MCP001', 'Master Control Program Agent', 'Group Management & Operations');
