// Database types based on the updated schema
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

export type UserRole = 'user' | 'supplier' | 'freelancer' | 'admin' | 'api';
export type KycStatus = 'pending' | 'submitted' | 'approved' | 'rejected';
export type GroupStatus = 'pending' | 'active' | 'closed' | 'archived';
export type GatewayType = 'purchasing' | 'marketing' | 'suppliers' | 'freelancers' | 'formation' | 'legal';
export type DocumentType = 'passport' | 'national_id' | 'license' | 'certificate' | 'other';

export interface Group {
  id: string;
  name: string;
  description?: string;
  gateway_type: GatewayType;
  status: GroupStatus;
  is_public: boolean;
  creator_id: string;
  country_id?: string;
  industry_sector_id?: string;
  current_members: number;
  max_members: number;
  group_number?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface Vote {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  threshold: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface VoteOption {
  id: string;
  vote_id: string;
  option_text: string;
  vote_count: number;
  created_at: string;
}

export interface UserVote {
  id: string;
  vote_id: string;
  user_id: string;
  option_id: string;
  created_at: string;
}

export interface Contract {
  id: string;
  group_id?: string;
  title: string;
  content: string;
  status: string;
  parties: any[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ArbitrationCase {
  id: string;
  case_number: string;
  title: string;
  description: string;
  type: string;
  complainant_id: string;
  respondent_id: string;
  group_id?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description?: string;
  payment_method?: string;
  transaction_reference?: string;
  status: string;
  created_at: string;
}

export interface UserBalance {
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  created_by: string;
  group_id?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  document_url?: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji?: string;
  currency_code?: string;
  created_at: string;
}

export interface IndustrySector {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  content: string;
  message_type: string;
  file_url?: string;
  is_read: boolean;
  created_at: string;
}
