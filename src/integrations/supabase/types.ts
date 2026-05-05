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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cleanup_logs: {
        Row: {
          created_at: string
          details: Json | null
          error_message: string | null
          files_deleted: number
          id: string
          orphan_files_found: number
          space_freed_bytes: number
          status: string
          triggered_by: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          error_message?: string | null
          files_deleted?: number
          id?: string
          orphan_files_found?: number
          space_freed_bytes?: number
          status?: string
          triggered_by?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          error_message?: string | null
          files_deleted?: number
          id?: string
          orphan_files_found?: number
          space_freed_bytes?: number
          status?: string
          triggered_by?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          portfolio_owner_id: string
          sender_email: string
          sender_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          portfolio_owner_id: string
          sender_email: string
          sender_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          portfolio_owner_id?: string
          sender_email?: string
          sender_name?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_verified: boolean | null
          user_id: string
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_verified?: boolean | null
          user_id: string
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_verified?: boolean | null
          user_id?: string
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          display_order: number | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          is_current: boolean | null
          start_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          degree: string
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          start_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          degree?: string
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_current: boolean | null
          position: string
          start_date: string | null
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position: string
          start_date?: string | null
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position?: string
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      plan_purchases: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          payment_method: string
          plan: string
          rejected_reason: string | null
          status: string
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_method: string
          plan?: string
          rejected_reason?: string | null
          status?: string
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          plan?: string
          rejected_reason?: string | null
          status?: string
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          bio: string | null
          brand_name: string | null
          created_at: string
          custom_head_html: string | null
          favicon_url: string | null
          google_verification: string | null
          headline: string | null
          id: string
          is_published: boolean | null
          location: string | null
          logo_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_image_url: string | null
          pending_publish: boolean | null
          phone: string | null
          publish_requested_at: string | null
          theme: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          brand_name?: string | null
          created_at?: string
          custom_head_html?: string | null
          favicon_url?: string | null
          google_verification?: string | null
          headline?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          pending_publish?: boolean | null
          phone?: string | null
          publish_requested_at?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          brand_name?: string | null
          created_at?: string
          custom_head_html?: string | null
          favicon_url?: string | null
          google_verification?: string | null
          headline?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          pending_publish?: boolean | null
          phone?: string | null
          publish_requested_at?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_approved: boolean | null
          phone_number: string | null
          plan: string
          plan_expires_at: string | null
          plan_purchased_at: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          phone_number?: string | null
          plan?: string
          plan_expires_at?: string | null
          plan_purchased_at?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          phone_number?: string | null
          plan?: string
          plan_expires_at?: string | null
          plan_purchased_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          featured: boolean | null
          github_url: string | null
          id: string
          image_url: string | null
          live_url: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          price: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          price?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          price?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          proficiency: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          proficiency?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          proficiency?: number | null
          user_id?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          platform: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          platform: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          platform?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          issue_type: string
          message: string
          replied_at: string | null
          replied_by: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          issue_type: string
          message: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          issue_type?: string
          message?: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      theme_purchases: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          payment_method: string
          rejected_reason: string | null
          status: string
          theme_id: string
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_method: string
          rejected_reason?: string | null
          status?: string
          theme_id: string
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          rejected_reason?: string | null
          status?: string
          theme_id?: string
          transaction_id?: string
          updated_at?: string
          user_id?: string
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
      cleanup_expired_otps: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
