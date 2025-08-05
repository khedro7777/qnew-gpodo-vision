
// Core platform types
export type UserRole = 'visitor' | 'user' | 'supplier' | 'freelancer' | 'admin' | 'api';
export type UserStatus = 'restricted' | 'pending' | 'verified' | 'active' | 'suspended' | 'banned';
export type KYCStatus = 'pending' | 'submitted' | 'approved' | 'rejected';
export type GroupStatus = 'pending' | 'active' | 'paused' | 'completed' | 'closed';
export type GatewayType = 'purchasing' | 'marketing' | 'company' | 'investment' | 'suppliers' | 'freelancers' | 'teams' | 'services' | 'products' | 'arbitration' | 'requests' | 'negotiation';

export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  role: UserRole;
  status: UserStatus;
  kyc_status: KYCStatus;
  country_code?: string;
  industry_sector?: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  gateway_type: GatewayType;
  status: GroupStatus;
  creator_id: string;
  country_id?: string;
  industry_sector_id?: string;
  current_members: number;
  max_members: number;
  is_public: boolean;
  entry_points: number;
  requires_kyc: boolean;
  requires_mcp_test: boolean;
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
  permissions: string[];
}

export interface Vote {
  id: string;
  group_id: string;
  title: string;
  description: string;
  created_by: string;
  type: 'simple' | 'weighted' | 'consensus';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  options: VoteOption[];
  start_date: string;
  end_date: string;
  threshold: number;
  results?: VoteResult[];
}

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface VoteResult {
  option_id: string;
  user_id: string;
  weight: number;
  created_at: string;
}

export interface Proposal {
  id: string;
  group_id: string;
  title: string;
  description: string;
  type: 'supplier' | 'freelancer' | 'service' | 'investment';
  created_by: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  amount?: number;
  currency?: string;
  deadline?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  group_id: string;
  proposal_id?: string;
  title: string;
  content: string;
  parties: string[];
  status: 'draft' | 'negotiation' | 'pending_signatures' | 'active' | 'completed' | 'terminated';
  signatures: ContractSignature[];
  created_at: string;
  expires_at?: string;
}

export interface ContractSignature {
  user_id: string;
  signed_at: string;
  signature_hash: string;
}

export interface ArbitrationCase {
  id: string;
  group_id: string;
  complainant_id: string;
  respondent_id: string;
  title: string;
  description: string;
  status: 'filed' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  evidence: string[];
  arbitrator_id?: string;
  decision?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Task {
  id: string;
  group_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  created_by: string;
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
  type: 'info' | 'success' | 'warning' | 'error' | 'vote' | 'proposal' | 'arbitration';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface MCPTest {
  id: string;
  user_id: string;
  test_type: string;
  questions: MCPQuestion[];
  answers: MCPAnswer[];
  score: number;
  status: 'pending' | 'completed' | 'passed' | 'failed';
  started_at: string;
  completed_at?: string;
}

export interface MCPQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  category: string;
}

export interface MCPAnswer {
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
}
