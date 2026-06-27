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
      contact_items: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          label: string | null
          type: string
          updated_at: string
          url: string | null
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          label?: string | null
          type?: string
          updated_at?: string
          url?: string | null
          user_id: string
          value?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          label?: string | null
          type?: string
          updated_at?: string
          url?: string | null
          user_id?: string
          value?: string
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
      dns_records: {
        Row: {
          content: string
          created_at: string
          domain_id: string
          id: string
          is_locked: boolean
          metadata: Json
          name: string
          priority: number | null
          proxied: boolean
          ttl: number
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          domain_id: string
          id?: string
          is_locked?: boolean
          metadata?: Json
          name: string
          priority?: number | null
          proxied?: boolean
          ttl?: number
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          domain_id?: string
          id?: string
          is_locked?: boolean
          metadata?: Json
          name?: string
          priority?: number | null
          proxied?: boolean
          ttl?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      domain_contacts: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          contact_type: string
          country: string | null
          created_at: string
          domain_id: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          contact_type: string
          country?: string | null
          created_at?: string
          domain_id: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          contact_type?: string
          country?: string | null
          created_at?: string
          domain_id?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_contacts_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "registrar_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_orders: {
        Row: {
          amount: number
          auth_code: string | null
          created_at: string
          currency: string
          domain_id: string | null
          domain_name: string
          id: string
          metadata: Json
          notes: string | null
          order_type: string
          payment_method: string | null
          processed_at: string | null
          processed_by: string | null
          provider_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
          years: number
        }
        Insert: {
          amount?: number
          auth_code?: string | null
          created_at?: string
          currency?: string
          domain_id?: string | null
          domain_name: string
          id?: string
          metadata?: Json
          notes?: string | null
          order_type: string
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          provider_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          years?: number
        }
        Update: {
          amount?: number
          auth_code?: string | null
          created_at?: string
          currency?: string
          domain_id?: string | null
          domain_name?: string
          id?: string
          metadata?: Json
          notes?: string | null
          order_type?: string
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          provider_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          years?: number
        }
        Relationships: [
          {
            foreignKeyName: "domain_orders_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "registrar_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domain_orders_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "registrar_providers"
            referencedColumns: ["id"]
          },
        ]
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
      feature_overrides: {
        Row: {
          created_at: string
          enabled: boolean
          feature_key: string
          id: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_key: string
          id?: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_key?: string
          id?: string
          note?: string | null
          updated_at?: string
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
      plans: {
        Row: {
          allow_branding_toggle: boolean
          allow_custom_domain: boolean
          allow_dev_features: boolean
          allow_seo: boolean
          created_at: string
          description: string | null
          extra_theme_price_bdt: number
          id: string
          included_premium_themes: number
          is_active: boolean
          key: string
          max_projects: number
          max_websites: number
          name: string
          premium_theme_access: string
          price_bdt: number
          sort_order: number
          storage_mb: number
          updated_at: string
        }
        Insert: {
          allow_branding_toggle?: boolean
          allow_custom_domain?: boolean
          allow_dev_features?: boolean
          allow_seo?: boolean
          created_at?: string
          description?: string | null
          extra_theme_price_bdt?: number
          id?: string
          included_premium_themes?: number
          is_active?: boolean
          key: string
          max_projects?: number
          max_websites?: number
          name: string
          premium_theme_access?: string
          price_bdt?: number
          sort_order?: number
          storage_mb?: number
          updated_at?: string
        }
        Update: {
          allow_branding_toggle?: boolean
          allow_custom_domain?: boolean
          allow_dev_features?: boolean
          allow_seo?: boolean
          created_at?: string
          description?: string | null
          extra_theme_price_bdt?: number
          id?: string
          included_premium_themes?: number
          is_active?: boolean
          key?: string
          max_projects?: number
          max_websites?: number
          name?: string
          premium_theme_access?: string
          price_bdt?: number
          sort_order?: number
          storage_mb?: number
          updated_at?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          about_headline: string | null
          about_image_url: string | null
          about_stats: Json | null
          about_text: string | null
          accent_color: string | null
          active_engine: string
          albums: Json | null
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
          hero_images: Json | null
          hero_marquee_words: string[] | null
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
          show_branding: boolean
          theme: string | null
          theme_software: Json | null
          updated_at: string
          user_id: string
          website: string | null
          website_type: string
        }
        Insert: {
          about_headline?: string | null
          about_image_url?: string | null
          about_stats?: Json | null
          about_text?: string | null
          accent_color?: string | null
          active_engine?: string
          albums?: Json | null
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
          hero_images?: Json | null
          hero_marquee_words?: string[] | null
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
          show_branding?: boolean
          theme?: string | null
          theme_software?: Json | null
          updated_at?: string
          user_id: string
          website?: string | null
          website_type?: string
        }
        Update: {
          about_headline?: string | null
          about_image_url?: string | null
          about_stats?: Json | null
          about_text?: string | null
          accent_color?: string | null
          active_engine?: string
          albums?: Json | null
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
          hero_images?: Json | null
          hero_marquee_words?: string[] | null
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
          show_branding?: boolean
          theme?: string | null
          theme_software?: Json | null
          updated_at?: string
          user_id?: string
          website?: string | null
          website_type?: string
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
          plan_key: string
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
          plan_key?: string
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
          plan_key?: string
          plan_purchased_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string | null
          cover_image: string | null
          created_at: string
          custom_category: string | null
          description: string | null
          display_order: number | null
          external_links: Json
          featured: boolean | null
          gallery: Json
          github_url: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          live_url: string | null
          project_date: string | null
          project_type: string
          sections: Json
          slug: string | null
          tags: string[] | null
          tech_stack: string[] | null
          title: string
          tools: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_name?: string | null
          cover_image?: string | null
          created_at?: string
          custom_category?: string | null
          description?: string | null
          display_order?: number | null
          external_links?: Json
          featured?: boolean | null
          gallery?: Json
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          live_url?: string | null
          project_date?: string | null
          project_type?: string
          sections?: Json
          slug?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          title: string
          tools?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_name?: string | null
          cover_image?: string | null
          created_at?: string
          custom_category?: string | null
          description?: string | null
          display_order?: number | null
          external_links?: Json
          featured?: boolean | null
          gallery?: Json
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          live_url?: string | null
          project_date?: string | null
          project_type?: string
          sections?: Json
          slug?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          title?: string
          tools?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registrar_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json
          domain_id: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          domain_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          domain_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      registrar_domains: {
        Row: {
          auto_renew: boolean
          created_at: string
          domain_name: string
          epp_code: string | null
          expires_at: string | null
          id: string
          id_protection: boolean
          metadata: Json
          nameservers: Json
          provider_id: string | null
          registered_at: string | null
          registrar_lock: boolean
          status: string
          updated_at: string
          user_id: string
          whois_privacy: boolean
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          domain_name: string
          epp_code?: string | null
          expires_at?: string | null
          id?: string
          id_protection?: boolean
          metadata?: Json
          nameservers?: Json
          provider_id?: string | null
          registered_at?: string | null
          registrar_lock?: boolean
          status?: string
          updated_at?: string
          user_id: string
          whois_privacy?: boolean
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          domain_name?: string
          epp_code?: string | null
          expires_at?: string | null
          id?: string
          id_protection?: boolean
          metadata?: Json
          nameservers?: Json
          provider_id?: string | null
          registered_at?: string | null
          registrar_lock?: boolean
          status?: string
          updated_at?: string
          user_id?: string
          whois_privacy?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "registrar_domains_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "registrar_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      registrar_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          metadata: Json
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          metadata?: Json
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          metadata?: Json
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      registrar_providers: {
        Row: {
          api_endpoint: string | null
          created_at: string
          credentials: Json
          id: string
          is_default: boolean
          is_enabled: boolean
          is_mock: boolean
          name: string
          notes: string | null
          provider_type: string
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          credentials?: Json
          id?: string
          is_default?: boolean
          is_enabled?: boolean
          is_mock?: boolean
          name: string
          notes?: string | null
          provider_type: string
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          credentials?: Json
          id?: string
          is_default?: boolean
          is_enabled?: boolean
          is_mock?: boolean
          name?: string
          notes?: string | null
          provider_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      registrar_settings: {
        Row: {
          description: string | null
          id: string
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          duration: string | null
          featured: boolean | null
          features: Json | null
          icon: string | null
          id: string
          price: string | null
          tagline: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string | null
          featured?: boolean | null
          features?: Json | null
          icon?: string | null
          id?: string
          price?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string | null
          featured?: boolean | null
          features?: Json | null
          icon?: string | null
          id?: string
          price?: string | null
          tagline?: string | null
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
          label: string | null
          platform: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          label?: string | null
          platform: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          label?: string | null
          platform?: string
          url?: string
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
      tld_pricing: {
        Row: {
          created_at: string
          currency: string
          display_order: number
          id: string
          is_active: boolean
          provider_id: string | null
          register_price: number
          renew_price: number
          tld: string
          transfer_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          display_order?: number
          id?: string
          is_active?: boolean
          provider_id?: string | null
          register_price?: number
          renew_price?: number
          tld: string
          transfer_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          display_order?: number
          id?: string
          is_active?: boolean
          provider_id?: string | null
          register_price?: number
          renew_price?: number
          tld?: string
          transfer_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tld_pricing_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "registrar_providers"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "user" | "super_admin" | "staff" | "customer"
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
      app_role: ["admin", "user", "super_admin", "staff", "customer"],
    },
  },
} as const
