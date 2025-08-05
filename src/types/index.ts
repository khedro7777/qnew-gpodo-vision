
export type UserRole = 'user' | 'supplier' | 'freelancer' | 'admin' | 'api';

export type KycStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export type GroupStatus = 'pending' | 'active' | 'paused' | 'completed' | 'closed';

export type GatewayType = 
  | 'purchasing' 
  | 'marketing' 
  | 'company' 
  | 'investment' 
  | 'suppliers' 
  | 'freelancers' 
  | 'teams' 
  | 'services' 
  | 'products' 
  | 'arbitration' 
  | 'requests' 
  | 'negotiation';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  role: UserRole;
  country_code?: string;
  industry_sector?: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  kyc_status: KycStatus;
  kyc_completed_at?: string;
  points?: number;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  gateway_type: GatewayType;
  creator_id: string;
  is_public: boolean;
  max_members: number;
  current_members: number;
  entry_points: number;
  requires_kyc: boolean;
  requires_mcp_test: boolean;
  status: GroupStatus;
  country_id?: string;
  industry_sector_id?: string;
  countries?: {
    name: string;
    flag_emoji: string;
  };
  industry_sectors?: {
    name: string;
    icon: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'founder' | 'admin' | 'member' | 'observer';
  status: 'pending' | 'active' | 'suspended';
  joined_at: string;
}

export interface Vote {
  id: string;
  group_id: string;
  title: string;
  description: string;
  type: 'simple' | 'weighted' | 'consensus';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  threshold: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  document_url?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  group_id?: string;
  title: string;
  content: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  parties: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ArbitrationCase {
  id: string;
  case_number: string;
  title: string;
  description: string;
  type: 'contract' | 'payment' | 'service' | 'ip' | 'partnership' | 'voting';
  complainant_id: string;
  respondent_id: string;
  group_id?: string;
  status: 'filed' | 'assigned' | 'investigation' | 'hearing' | 'decision' | 'appeal' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_by: string;
  group_id?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface MCPTest {
  id: string;
  user_id: string;
  test_score: number;
  test_data: any;
  status: KycStatus;
  reviewer_notes?: string;
  completed_at: string;
  reviewed_at?: string;
  created_at: string;
}
