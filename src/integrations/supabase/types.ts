export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          token: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      api_users: {
        Row: {
          bypass_kyc: boolean
          created_at: string
          email: string
          full_privileges: boolean
          id: string
          updated_at: string
        }
        Insert: {
          bypass_kyc?: boolean
          created_at?: string
          email: string
          full_privileges?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          bypass_kyc?: boolean
          created_at?: string
          email?: string
          full_privileges?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          admin_notes: string | null
          attachments: string[] | null
          complaint_number: string
          created_at: string
          from_user_id: string
          id: string
          invoice_id: string | null
          message: string
          offer_id: string | null
          status: string
          subject: string
          supplier_id: string | null
          supplier_reply: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          attachments?: string[] | null
          complaint_number: string
          created_at?: string
          from_user_id: string
          id?: string
          invoice_id?: string | null
          message: string
          offer_id?: string | null
          status?: string
          subject: string
          supplier_id?: string | null
          supplier_reply?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          attachments?: string[] | null
          complaint_number?: string
          created_at?: string
          from_user_id?: string
          id?: string
          invoice_id?: string | null
          message?: string
          offer_id?: string | null
          status?: string
          subject?: string
          supplier_id?: string | null
          supplier_reply?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "group_discount_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      content_entries: {
        Row: {
          content_type_id: string
          created_at: string
          created_by: string
          data: Json
          id: string
          published_at: string | null
          status: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          content_type_id: string
          created_at?: string
          created_by: string
          data?: Json
          id?: string
          published_at?: string | null
          status?: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          content_type_id?: string
          created_at?: string
          created_by?: string
          data?: Json
          id?: string
          published_at?: string | null
          status?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_entries_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_types"
            referencedColumns: ["id"]
          },
        ]
      }
      content_types: {
        Row: {
          api_id: string
          created_at: string
          fields: Json
          id: string
          name: string
          permissions: Json
          singular_name: string
          updated_at: string
        }
        Insert: {
          api_id: string
          created_at?: string
          fields?: Json
          id?: string
          name: string
          permissions?: Json
          singular_name: string
          updated_at?: string
        }
        Update: {
          api_id?: string
          created_at?: string
          fields?: Json
          id?: string
          name?: string
          permissions?: Json
          singular_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          currency_code: string | null
          flag_emoji: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          currency_code?: string | null
          flag_emoji?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          currency_code?: string | null
          flag_emoji?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      election_candidates: {
        Row: {
          campaign_message: string | null
          election_id: string | null
          id: string
          level_position: number | null
          nominated_at: string | null
          user_id: string | null
          vote_count: number | null
        }
        Insert: {
          campaign_message?: string | null
          election_id?: string | null
          id?: string
          level_position?: number | null
          nominated_at?: string | null
          user_id?: string | null
          vote_count?: number | null
        }
        Update: {
          campaign_message?: string | null
          election_id?: string | null
          id?: string
          level_position?: number | null
          nominated_at?: string | null
          user_id?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "election_candidates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "group_elections"
            referencedColumns: ["id"]
          },
        ]
      }
      election_votes: {
        Row: {
          candidate_id: string | null
          election_id: string | null
          id: string
          voted_at: string | null
          voter_id: string | null
        }
        Insert: {
          candidate_id?: string | null
          election_id?: string | null
          id?: string
          voted_at?: string | null
          voter_id?: string | null
        }
        Update: {
          candidate_id?: string | null
          election_id?: string | null
          id?: string
          voted_at?: string | null
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "election_votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "election_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_votes_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "group_elections"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          completed: boolean
          completed_at: string | null
          duration_minutes: number
          id: string
          notes: string | null
          started_at: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          started_at?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          started_at?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      group_discount_offers: {
        Row: {
          base_price: number
          category: string | null
          created_at: string
          current_participants: number | null
          deadline: string
          description: string | null
          did_identifier: string | null
          id: string
          kyc_required: boolean | null
          minimum_joiners: number
          pdf_attachments: string[] | null
          points_required: number | null
          product_images: string[] | null
          sales_agreement_template: string | null
          status: string
          supplier_id: string
          target_region: string | null
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          base_price: number
          category?: string | null
          created_at?: string
          current_participants?: number | null
          deadline: string
          description?: string | null
          did_identifier?: string | null
          id?: string
          kyc_required?: boolean | null
          minimum_joiners?: number
          pdf_attachments?: string[] | null
          points_required?: number | null
          product_images?: string[] | null
          sales_agreement_template?: string | null
          status?: string
          supplier_id: string
          target_region?: string | null
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          base_price?: number
          category?: string | null
          created_at?: string
          current_participants?: number | null
          deadline?: string
          description?: string | null
          did_identifier?: string | null
          id?: string
          kyc_required?: boolean | null
          minimum_joiners?: number
          pdf_attachments?: string[] | null
          points_required?: number | null
          product_images?: string[] | null
          sales_agreement_template?: string | null
          status?: string
          supplier_id?: string
          target_region?: string | null
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      group_discount_tiers: {
        Row: {
          created_at: string
          discount_percent: number | null
          fixed_price: number | null
          id: string
          min_members: number
          offer_id: string
          tier_order: number
        }
        Insert: {
          created_at?: string
          discount_percent?: number | null
          fixed_price?: number | null
          id?: string
          min_members: number
          offer_id: string
          tier_order: number
        }
        Update: {
          created_at?: string
          discount_percent?: number | null
          fixed_price?: number | null
          id?: string
          min_members?: number
          offer_id?: string
          tier_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_discount_tiers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "group_discount_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      group_elections: {
        Row: {
          created_at: string | null
          created_by: string | null
          election_type: string
          end_date: string
          group_id: string | null
          id: string
          max_candidates: number | null
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          election_type?: string
          end_date: string
          group_id?: string | null
          id?: string
          max_candidates?: number | null
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          election_type?: string
          end_date?: string
          group_id?: string | null
          id?: string
          max_candidates?: number | null
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_elections_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_offer_members: {
        Row: {
          amount_paid: number | null
          id: string
          joined_at: string
          offer_id: string
          payment_status: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          id?: string
          joined_at?: string
          offer_id: string
          payment_status?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          id?: string
          joined_at?: string
          offer_id?: string
          payment_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_offer_members_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "group_discount_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      group_performance_reports: {
        Row: {
          active_members: number | null
          completed_projects: number | null
          created_at: string | null
          generated_by: string | null
          group_id: string | null
          id: string
          member_satisfaction: number | null
          performance_score: number | null
          report_data: Json | null
          report_period: string
          total_savings: number | null
        }
        Insert: {
          active_members?: number | null
          completed_projects?: number | null
          created_at?: string | null
          generated_by?: string | null
          group_id?: string | null
          id?: string
          member_satisfaction?: number | null
          performance_score?: number | null
          report_data?: Json | null
          report_period: string
          total_savings?: number | null
        }
        Update: {
          active_members?: number | null
          completed_projects?: number | null
          created_at?: string | null
          generated_by?: string | null
          group_id?: string | null
          id?: string
          member_satisfaction?: number | null
          performance_score?: number | null
          report_data?: Json | null
          report_period?: string
          total_savings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_performance_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "mcp_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_performance_reports_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_proposals: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          document_url: string | null
          group_id: string
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          document_url?: string | null
          group_id: string
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          document_url?: string | null
          group_id?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_proposals_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          country_id: string | null
          created_at: string
          creator_id: string
          current_members: number | null
          description: string | null
          gateway_type: Database["public"]["Enums"]["gateway_type"]
          group_number: string | null
          id: string
          industry_sector_id: string | null
          is_public: boolean
          max_members: number | null
          name: string
          status: Database["public"]["Enums"]["group_status"]
          updated_at: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          creator_id: string
          current_members?: number | null
          description?: string | null
          gateway_type: Database["public"]["Enums"]["gateway_type"]
          group_number?: string | null
          id?: string
          industry_sector_id?: string | null
          is_public?: boolean
          max_members?: number | null
          name: string
          status?: Database["public"]["Enums"]["group_status"]
          updated_at?: string
        }
        Update: {
          country_id?: string | null
          created_at?: string
          creator_id?: string
          current_members?: number | null
          description?: string | null
          gateway_type?: Database["public"]["Enums"]["gateway_type"]
          group_number?: string | null
          id?: string
          industry_sector_id?: string | null
          is_public?: boolean
          max_members?: number | null
          name?: string
          status?: Database["public"]["Enums"]["group_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_industry_sector_id_fkey"
            columns: ["industry_sector_id"]
            isOneToOne: false
            referencedRelation: "industry_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_sectors: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          currency: string
          description: string
          due_date: string
          id: string
          invoice_number: string
          offer_id: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          currency?: string
          description: string
          due_date: string
          id?: string
          invoice_number: string
          offer_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          currency?: string
          description?: string
          due_date?: string
          id?: string
          invoice_number?: string
          offer_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "group_discount_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      ipfs_storage: {
        Row: {
          created_at: string | null
          file_hash: string
          file_name: string
          file_size: number | null
          file_type: string | null
          group_id: string | null
          id: string
          metadata: Json | null
          storage_purpose: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_hash: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          storage_purpose?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_hash?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          storage_purpose?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ipfs_storage_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_url: string
          id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_url: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_url?: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mcp_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          group_id: string | null
          id: string
          mcp_agent_id: string | null
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          mcp_agent_id?: string | null
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          mcp_agent_id?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mcp_activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_activities_mcp_agent_id_fkey"
            columns: ["mcp_agent_id"]
            isOneToOne: false
            referencedRelation: "mcp_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_agents: {
        Row: {
          agent_code: string
          created_at: string | null
          full_name: string
          id: string
          is_active: boolean | null
          specialization: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_code: string
          created_at?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_code?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mcp_test_results: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          test_data: Json
          test_score: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          test_data: Json
          test_score: number
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          test_data?: Json
          test_score?: number
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          file_url: string | null
          group_id: string | null
          id: string
          is_read: boolean
          message_type: string
          receiver_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_url?: string | null
          group_id?: string | null
          id?: string
          is_read?: boolean
          message_type?: string
          receiver_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_url?: string | null
          group_id?: string | null
          id?: string
          is_read?: boolean
          message_type?: string
          receiver_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          country_code: string | null
          created_at: string
          did_identifier: string | null
          did_metadata: Json | null
          email: string
          full_name: string | null
          id: string
          industry_sector: string | null
          is_verified: boolean
          kyc_completed_at: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          country_code?: string | null
          created_at?: string
          did_identifier?: string | null
          did_metadata?: Json | null
          email: string
          full_name?: string | null
          id: string
          industry_sector?: string | null
          is_verified?: boolean
          kyc_completed_at?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          country_code?: string | null
          created_at?: string
          did_identifier?: string | null
          did_metadata?: Json | null
          email?: string
          full_name?: string | null
          id?: string
          industry_sector?: string | null
          is_verified?: boolean
          kyc_completed_at?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      referral_links: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          target_audience: string | null
          title: string
          updated_at: string | null
          url: string
          visible_in: string[] | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
          url: string
          visible_in?: string[] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          visible_in?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payment_settings: {
        Row: {
          created_at: string
          crypto_wallet_btc: string | null
          crypto_wallet_eth: string | null
          crypto_wallet_usdt: string | null
          id: string
          paypal_client_id: string | null
          paypal_email: string | null
          paypal_secret_encrypted: string | null
          supplier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crypto_wallet_btc?: string | null
          crypto_wallet_eth?: string | null
          crypto_wallet_usdt?: string | null
          id?: string
          paypal_client_id?: string | null
          paypal_email?: string | null
          paypal_secret_encrypted?: string | null
          supplier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crypto_wallet_btc?: string | null
          crypto_wallet_eth?: string | null
          crypto_wallet_usdt?: string | null
          id?: string
          paypal_client_id?: string | null
          paypal_email?: string | null
          paypal_secret_encrypted?: string | null
          supplier_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string
          message: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          severity?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          group_id: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          group_id?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          group_id?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          completed: boolean
          created_at: string
          current_value: number
          description: string | null
          due_date: string | null
          goal_type: string
          id: string
          target_value: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_value?: number
          description?: string | null
          due_date?: string | null
          goal_type: string
          id?: string
          target_value: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_value?: number
          description?: string | null
          due_date?: string | null
          goal_type?: string
          id?: string
          target_value?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          id: string
          is_active: boolean
          is_approved: boolean
          requested_at: string
          role: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          requested_at?: string
          role: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          requested_at?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_complaint_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_group_number: {
        Args: { gateway_type: string }
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_primary_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role_type"]
      }
      has_role: {
        Args: {
          user_id: string
          role_name: Database["public"]["Enums"]["user_role_type"]
        }
        Returns: boolean
      }
      is_api_user: {
        Args: { user_email: string }
        Returns: boolean
      }
      spend_wallet_balance: {
        Args: { p_user_id: string; p_amount: number; p_description: string }
        Returns: boolean
      }
      update_wallet_balance: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description: string
          p_payment_method?: string
          p_payment_reference?: string
        }
        Returns: string
      }
    }
    Enums: {
      document_type:
        | "id_card"
        | "passport"
        | "company_registration"
        | "business_license"
      gateway_type:
        | "purchasing"
        | "marketing"
        | "suppliers"
        | "freelancers"
        | "formation"
        | "legal"
      group_status: "active" | "pending" | "closed" | "archived"
      kyc_status: "pending" | "submitted" | "approved" | "rejected"
      user_role: "user" | "supplier" | "freelancer" | "admin" | "api"
      user_role_type:
        | "supplier"
        | "buyer"
        | "freelancer"
        | "group_member"
        | "investor"
        | "judge"
        | "admin"
        | "ai_agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: [
        "id_card",
        "passport",
        "company_registration",
        "business_license",
      ],
      gateway_type: [
        "purchasing",
        "marketing",
        "suppliers",
        "freelancers",
        "formation",
        "legal",
      ],
      group_status: ["active", "pending", "closed", "archived"],
      kyc_status: ["pending", "submitted", "approved", "rejected"],
      user_role: ["user", "supplier", "freelancer", "admin", "api"],
      user_role_type: [
        "supplier",
        "buyer",
        "freelancer",
        "group_member",
        "investor",
        "judge",
        "admin",
        "ai_agent",
      ],
    },
  },
} as const
