export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string
          id: string
          notes: string | null
          opportunity_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          id?: string
          notes?: string | null
          opportunity_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          id?: string
          notes?: string | null
          opportunity_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      career_goal_skills: {
        Row: {
          career_goal: string
          id: string
          importance: number
          skill_id: string
        }
        Insert: {
          career_goal: string
          id?: string
          importance?: number
          skill_id: string
        }
        Update: {
          career_goal?: string
          id?: string
          importance?: number
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_goal_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          logo: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          cgpa: number | null
          college: string | null
          created_at: string
          degree: string | null
          field_of_study: string | null
          graduation_year: number | null
          id: string
          percentage: number | null
          profile_id: string
          university: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cgpa?: number | null
          college?: string | null
          created_at?: string
          degree?: string | null
          field_of_study?: string | null
          graduation_year?: number | null
          id?: string
          percentage?: number | null
          profile_id: string
          university?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cgpa?: number | null
          college?: string | null
          created_at?: string
          degree?: string | null
          field_of_study?: string | null
          graduation_year?: number | null
          id?: string
          percentage?: number | null
          profile_id?: string
          university?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      help_articles: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          certificate: boolean | null
          company_id: string | null
          created_at: string
          deadline: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          eligibility: string | null
          event_date: string | null
          experience_level: string | null
          external_url: string | null
          id: string
          is_demo: boolean
          is_free: boolean | null
          last_checked_at: string | null
          location: string | null
          opportunity_type: string
          organizer: string | null
          price: string | null
          prize: string | null
          provider: string | null
          responsibilities: string | null
          salary_max: number | null
          salary_min: number | null
          source_name: string | null
          source_url: string | null
          status: string
          stipend: string | null
          team_size: string | null
          theme: string | null
          title: string
          updated_at: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
          work_mode: string | null
        }
        Insert: {
          certificate?: boolean | null
          company_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          eligibility?: string | null
          event_date?: string | null
          experience_level?: string | null
          external_url?: string | null
          id?: string
          is_demo?: boolean
          is_free?: boolean | null
          last_checked_at?: string | null
          location?: string | null
          opportunity_type: string
          organizer?: string | null
          price?: string | null
          prize?: string | null
          provider?: string | null
          responsibilities?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source_name?: string | null
          source_url?: string | null
          status?: string
          stipend?: string | null
          team_size?: string | null
          theme?: string | null
          title: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          work_mode?: string | null
        }
        Update: {
          certificate?: boolean | null
          company_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          eligibility?: string | null
          event_date?: string | null
          experience_level?: string | null
          external_url?: string | null
          id?: string
          is_demo?: boolean
          is_free?: boolean | null
          last_checked_at?: string | null
          location?: string | null
          opportunity_type?: string
          organizer?: string | null
          price?: string | null
          prize?: string | null
          provider?: string | null
          responsibilities?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source_name?: string | null
          source_url?: string | null
          status?: string
          stipend?: string | null
          team_size?: string | null
          theme?: string | null
          title?: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          work_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_skills: {
        Row: {
          opportunity_id: string
          required: boolean
          skill_id: string
        }
        Insert: {
          opportunity_id: string
          required?: boolean
          skill_id: string
        }
        Update: {
          opportunity_id?: string
          required?: boolean
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_skills_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_interests: {
        Row: {
          created_at: string
          interest_id: string
          profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          interest_id: string
          profile_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          interest_id?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          created_at: string
          profile_id: string
          skill_id: string
          skill_level: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          skill_id: string
          skill_level?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          skill_id?: string
          skill_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          career_goal: string | null
          created_at: string
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string
          location: string | null
          onboarding_completed: boolean
          phone: string | null
          preferred_locations: string[]
          preferred_types: string[]
          preferred_work_modes: string[]
          profile_image: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          career_goal?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          preferred_locations?: string[]
          preferred_types?: string[]
          preferred_work_modes?: string[]
          profile_image?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          career_goal?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          preferred_locations?: string[]
          preferred_types?: string[]
          preferred_work_modes?: string[]
          profile_image?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_analysis: {
        Row: {
          created_at: string
          detected_skills: string[]
          experience_score: number | null
          formatting_score: number | null
          id: string
          keyword_score: number | null
          overall_score: number | null
          projects_score: number | null
          resume_id: string
          skills_score: number | null
          suggestions: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          detected_skills?: string[]
          experience_score?: number | null
          formatting_score?: number | null
          id?: string
          keyword_score?: number | null
          overall_score?: number | null
          projects_score?: number | null
          resume_id: string
          skills_score?: number | null
          suggestions?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          detected_skills?: string[]
          experience_score?: number | null
          formatting_score?: number | null
          id?: string
          keyword_score?: number | null
          overall_score?: number | null
          projects_score?: number | null
          resume_id?: string
          skills_score?: number | null
          suggestions?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_analysis_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          extracted_text: string | null
          file_name: string
          file_type: string | null
          id: string
          storage_path: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          extracted_text?: string | null
          file_name: string
          file_type?: string | null
          id?: string
          storage_path: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          extracted_text?: string | null
          file_name?: string
          file_type?: string | null
          id?: string
          storage_path?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["student", "admin"],
    },
  },
} as const
