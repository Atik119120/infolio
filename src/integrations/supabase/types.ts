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
      admin_themes: {
        Row: {
          created_at: string
          created_by: string | null
          css: string
          description: string | null
          ecommerce_capable: boolean
          html: string
          id: string
          is_active: boolean
          js: string
          name: string
          preview_image_url: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          css?: string
          description?: string | null
          ecommerce_capable?: boolean
          html?: string
          id?: string
          is_active?: boolean
          js?: string
          name: string
          preview_image_url?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          css?: string
          description?: string | null
          ecommerce_capable?: boolean
          html?: string
          id?: string
          is_active?: boolean
          js?: string
          name?: string
          preview_image_url?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      builder_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_published: boolean
          name: string
          published_at: string | null
          published_content: Json | null
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          published_at?: string | null
          published_content?: Json | null
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          published_at?: string | null
          published_content?: Json | null
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      builder_sections: {
        Row: {
          block: Json
          created_at: string
          id: string
          name: string
          preview_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          block: Json
          created_at?: string
          id?: string
          name?: string
          preview_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          block?: Json
          created_at?: string
          id?: string
          name?: string
          preview_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      deployments: {
        Row: {
          active_theme_template: string | null
          assigned_subdomain: string | null
          created_at: string
          deploy_url: string | null
          deployment_url: string | null
          error: string | null
          id: string
          is_active: boolean
          logs: Json
          project_name: string | null
          ready_at: string | null
          repo_full_name: string | null
          source: string
          status: string
          subdomain: string | null
          updated_at: string
          user_id: string
          vercel_deployment_id: string | null
          vercel_project_id: string | null
        }
        Insert: {
          active_theme_template?: string | null
          assigned_subdomain?: string | null
          created_at?: string
          deploy_url?: string | null
          deployment_url?: string | null
          error?: string | null
          id?: string
          is_active?: boolean
          logs?: Json
          project_name?: string | null
          ready_at?: string | null
          repo_full_name?: string | null
          source?: string
          status?: string
          subdomain?: string | null
          updated_at?: string
          user_id: string
          vercel_deployment_id?: string | null
          vercel_project_id?: string | null
        }
        Update: {
          active_theme_template?: string | null
          assigned_subdomain?: string | null
          created_at?: string
          deploy_url?: string | null
          deployment_url?: string | null
          error?: string | null
          id?: string
          is_active?: boolean
          logs?: Json
          project_name?: string | null
          ready_at?: string | null
          repo_full_name?: string | null
          source?: string
          status?: string
          subdomain?: string | null
          updated_at?: string
          user_id?: string
          vercel_deployment_id?: string | null
          vercel_project_id?: string | null
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
      order_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          order_id: string
          price: number
          product_id: string | null
          qty: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          order_id: string
          price: number
          product_id?: string | null
          qty?: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          order_id?: string
          price?: number
          product_id?: string | null
          qty?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_fee: number
          shipping_zip: string | null
          status: string
          store_owner_id: string
          subtotal: number
          tax: number
          total: number
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_fee?: number
          shipping_zip?: string | null
          status?: string
          store_owner_id: string
          subtotal?: number
          tax?: number
          total?: number
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_fee?: number
          shipping_zip?: string | null
          status?: string
          store_owner_id?: string
          subtotal?: number
          tax?: number
          total?: number
          transaction_id?: string | null
          updated_at?: string
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
      page_views: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string
          device: string | null
          id: string
          os: string | null
          owner_id: string
          page_type: string
          path: string | null
          referrer: string | null
          slug: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_hash: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          os?: string | null
          owner_id: string
          page_type: string
          path?: string | null
          referrer?: string | null
          slug?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_hash?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          os?: string | null
          owner_id?: string
          page_type?: string
          path?: string | null
          referrer?: string | null
          slug?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_hash?: string | null
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
          about_image_url: string | null
          about_text: string | null
          accent_color: string | null
          active_engine: string
          bio: string | null
          brand_name: string | null
          browser_title: string | null
          created_at: string
          custom_css: string | null
          custom_head_html: string | null
          custom_html: string | null
          custom_js: string | null
          engine_backups: Json
          favicon_url: string | null
          footer_text: string | null
          ga_measurement_id: string | null
          google_verification: string | null
          gtm_id: string | null
          header_html: string | null
          headline: string | null
          hero_cta_link: string | null
          hero_cta_text: string | null
          hero_headline: string | null
          hero_image_url: string | null
          hero_subheadline: string | null
          id: string
          is_published: boolean | null
          location: string | null
          logo_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_image_url: string | null
          phone: string | null
          primary_color: string | null
          section_visibility: Json | null
          theme: string | null
          updated_at: string
          user_id: string
          website: string | null
          website_type: string
        }
        Insert: {
          about_image_url?: string | null
          about_text?: string | null
          accent_color?: string | null
          active_engine?: string
          bio?: string | null
          brand_name?: string | null
          browser_title?: string | null
          created_at?: string
          custom_css?: string | null
          custom_head_html?: string | null
          custom_html?: string | null
          custom_js?: string | null
          engine_backups?: Json
          favicon_url?: string | null
          footer_text?: string | null
          ga_measurement_id?: string | null
          google_verification?: string | null
          gtm_id?: string | null
          header_html?: string | null
          headline?: string | null
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          phone?: string | null
          primary_color?: string | null
          section_visibility?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          website_type?: string
        }
        Update: {
          about_image_url?: string | null
          about_text?: string | null
          accent_color?: string | null
          active_engine?: string
          bio?: string | null
          brand_name?: string | null
          browser_title?: string | null
          created_at?: string
          custom_css?: string | null
          custom_head_html?: string | null
          custom_html?: string | null
          custom_js?: string | null
          engine_backups?: Json
          favicon_url?: string | null
          footer_text?: string | null
          ga_measurement_id?: string | null
          google_verification?: string | null
          gtm_id?: string | null
          header_html?: string | null
          headline?: string | null
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          phone?: string | null
          primary_color?: string | null
          section_visibility?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          website_type?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          category: string | null
          compare_at_price: number | null
          created_at: string
          description: string | null
          display_order: number
          featured: boolean
          gallery: Json
          id: string
          image_url: string | null
          price: number
          rating: number | null
          sku: string | null
          slug: string
          status: string
          stock: number
          tags: string[]
          title: string
          track_inventory: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          badge?: string | null
          category?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          gallery?: Json
          id?: string
          image_url?: string | null
          price?: number
          rating?: number | null
          sku?: string | null
          slug: string
          status?: string
          stock?: number
          tags?: string[]
          title: string
          track_inventory?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          badge?: string | null
          category?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          gallery?: Json
          id?: string
          image_url?: string | null
          price?: number
          rating?: number | null
          sku?: string | null
          slug?: string
          status?: string
          stock?: number
          tags?: string[]
          title?: string
          track_inventory?: boolean
          updated_at?: string
          user_id?: string
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
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
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
      stores: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          currency_symbol: string
          id: string
          is_active: boolean
          name: string
          payment_instructions: string | null
          payment_methods: Json
          shipping_fee: number
          tax_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          currency_symbol?: string
          id?: string
          is_active?: boolean
          name?: string
          payment_instructions?: string | null
          payment_methods?: Json
          shipping_fee?: number
          tax_rate?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          currency_symbol?: string
          id?: string
          is_active?: boolean
          name?: string
          payment_instructions?: string | null
          payment_methods?: Json
          shipping_fee?: number
          tax_rate?: number
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
      user_integrations: {
        Row: {
          access_token: string
          account_login: string | null
          created_at: string
          id: string
          metadata: Json
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_login?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_login?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_integrations_config: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          provider?: string
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
      resolve_active_deployment: {
        Args: { _hostname: string }
        Returns: {
          active_theme_template: string
          assigned_subdomain: string
          deployment_status: string
          deployment_url: string
          project_id: string
          ready_at: string
          username: string
        }[]
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
