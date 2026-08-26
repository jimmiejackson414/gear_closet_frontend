export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answers: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          profile_id: string | null
          question_id: number | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          question_id?: number | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          question_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string | null
          pack_id: number | null
          position: number
          slug: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          pack_id?: number | null
          position?: number
          slug?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          pack_id?: number | null
          position?: number
          slug?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      category_items: {
        Row: {
          category_id: number | null
          created_at: string | null
          id: number
          item_id: number | null
          position: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          item_id?: number | null
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          item_id?: number | null
          position?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: number
          pack_id: number
          profile_id: string
          text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          pack_id: number
          profile_id: string
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          pack_id?: number
          profile_id?: string
          text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          deleted_at: string | null
          id: string
          profile_id: string
          stripe_customer_id: string | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          profile_id: string
          stripe_customer_id?: string | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          profile_id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_invitations: {
        Row: {
          created_at: string | null
          id: number
          recipient_id: string | null
          request_responded_at: string | null
          request_sent_at: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["friend_request_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          recipient_id?: string | null
          request_responded_at?: string | null
          request_sent_at?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["friend_request_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          recipient_id?: string | null
          request_responded_at?: string | null
          request_sent_at?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["friend_request_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_invitations_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_invitations_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_invite_attempts: {
        Row: {
          created_at: string
          email: string | null
          email_count: number
          id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          email_count?: number
          id?: number
          profile_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          email_count?: number
          id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_invite_attempts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: number
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: number
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: number
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          consumable: boolean | null
          created_at: string | null
          generic_type: string | null
          id: number
          name: string | null
          price: number | null
          profile_id: string | null
          quantity: number | null
          slug: string
          unit: Database["public"]["Enums"]["item_unit"]
          updated_at: string | null
          url: string | null
          weight: string | null
          worn: boolean | null
        }
        Insert: {
          consumable?: boolean | null
          created_at?: string | null
          generic_type?: string | null
          id?: number
          name?: string | null
          price?: number | null
          profile_id?: string | null
          quantity?: number | null
          slug: string
          unit?: Database["public"]["Enums"]["item_unit"]
          updated_at?: string | null
          url?: string | null
          weight?: string | null
          worn?: boolean | null
        }
        Update: {
          consumable?: boolean | null
          created_at?: string | null
          generic_type?: string | null
          id?: number
          name?: string | null
          price?: number | null
          profile_id?: string | null
          quantity?: number | null
          slug?: string
          unit?: Database["public"]["Enums"]["item_unit"]
          updated_at?: string | null
          url?: string | null
          weight?: string | null
          worn?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          profile_id: string | null
          read_on_date: string | null
          sender_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          read_on_date?: string | null
          sender_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          read_on_date?: string | null
          sender_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          completion_date: string | null
          created_at: string
          page: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          page: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          page?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          allow_comments: boolean
          created_at: string | null
          id: number
          locked_at: string | null
          name: string | null
          private: boolean
          profile_id: string
          slug: string | null
          theme: Database["public"]["Enums"]["theme"] | null
          updated_at: string | null
        }
        Insert: {
          allow_comments?: boolean
          created_at?: string | null
          id?: number
          locked_at?: string | null
          name?: string | null
          private?: boolean
          profile_id: string
          slug?: string | null
          theme?: Database["public"]["Enums"]["theme"] | null
          updated_at?: string | null
        }
        Update: {
          allow_comments?: boolean
          created_at?: string | null
          id?: number
          locked_at?: string | null
          name?: string | null
          private?: boolean
          profile_id?: string
          slug?: string | null
          theme?: Database["public"]["Enums"]["theme"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          id: number
          profile_id: string | null
          trip_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          environment: string | null
          id: string
          identifier: Database["public"]["Enums"]["subscription_level"] | null
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          environment?: string | null
          id: string
          identifier?: Database["public"]["Enums"]["subscription_level"] | null
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          environment?: string | null
          id?: string
          identifier?: Database["public"]["Enums"]["subscription_level"] | null
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          description: string | null
          environment: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: Database["public"]["Enums"]["subscription_level"] | null
        }
        Insert: {
          active?: boolean
          description?: string | null
          environment?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: Database["public"]["Enums"]["subscription_level"] | null
        }
        Update: {
          active?: boolean
          description?: string | null
          environment?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: Database["public"]["Enums"]["subscription_level"] | null
        }
        Relationships: []
      }
      profile_answers: {
        Row: {
          answer_id: number | null
          created_at: string | null
          id: number
          poll_id: number | null
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          answer_id?: number | null
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          answer_id?: number | null
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_answers_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_answers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_1: string | null
          address_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          deactivated_at: string | null
          email: string
          first_name: string | null
          fts: unknown
          id: string
          image: string | null
          last_name: string | null
          location: Json | null
          measuring_system:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          needs_free_resource_selection: boolean
          onboard_date: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          slug: string
          state: string | null
          trail_name: string | null
          updated_at: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          deactivated_at?: string | null
          email: string
          first_name?: string | null
          fts?: unknown
          id: string
          image?: string | null
          last_name?: string | null
          location?: Json | null
          measuring_system?:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          needs_free_resource_selection?: boolean
          onboard_date?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          slug: string
          state?: string | null
          trail_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          deactivated_at?: string | null
          email?: string
          first_name?: string | null
          fts?: unknown
          id?: string
          image?: string | null
          last_name?: string | null
          location?: Json | null
          measuring_system?:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          needs_free_resource_selection?: boolean
          onboard_date?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          slug?: string
          state?: string | null
          trail_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string | null
          id: number
          poll_id: number | null
          profile_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      replies: {
        Row: {
          comment_id: number
          created_at: string | null
          deleted_at: string | null
          id: number
          profile_id: string
          text: string | null
          updated_at: string | null
        }
        Insert: {
          comment_id: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          profile_id: string
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          comment_id?: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          profile_id?: string
          text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_items: {
        Row: {
          completed: boolean
          created_at: string | null
          id: number
          profile_id: string | null
          quantity: number | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          title: string | null
          trip_id: number | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          quantity?: number | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          quantity?: number | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          profile_id: string
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          profile_id: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          profile_id?: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          completed: boolean
          created_at: string | null
          id: number
          profile_id: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          title: string | null
          trip_id: number | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_details: {
        Row: {
          created_at: string | null
          id: number
          title: string | null
          trip_id: number | null
          type: Database["public"]["Enums"]["trip_details_type"]
          updated_at: string
          url: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          title?: string | null
          trip_id?: number | null
          type?: Database["public"]["Enums"]["trip_details_type"]
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string | null
          trip_id?: number | null
          type?: Database["public"]["Enums"]["trip_details_type"]
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_details_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_friends: {
        Row: {
          accepted_invite_on: string | null
          created_at: string | null
          id: number
          invite_token: string | null
          invited_by_id: string
          profile_id: string
          status: Database["public"]["Enums"]["trip_friend_status"]
          trip_id: number | null
          updated_at: string
        }
        Insert: {
          accepted_invite_on?: string | null
          created_at?: string | null
          id?: number
          invite_token?: string | null
          invited_by_id: string
          profile_id: string
          status?: Database["public"]["Enums"]["trip_friend_status"]
          trip_id?: number | null
          updated_at?: string
        }
        Update: {
          accepted_invite_on?: string | null
          created_at?: string | null
          id?: number
          invite_token?: string | null
          invited_by_id?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["trip_friend_status"]
          trip_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_friends_invited_by_id_fkey"
            columns: ["invited_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_friends_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_friends_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_invite_attempts: {
        Row: {
          created_at: string
          email_count: number
          id: number
          profile_id: string
          trip_id: number
        }
        Insert: {
          created_at?: string
          email_count?: number
          id?: number
          profile_id: string
          trip_id: number
        }
        Update: {
          created_at?: string
          email_count?: number
          id?: number
          profile_id?: string
          trip_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trip_invite_attempts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_invite_attempts_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_invitations: {
        Row: {
          claimed_profile_id: string | null
          created_at: string
          email: string
          expires_at: string
          id: number
          invited_by_id: string
          status: Database["public"]["Enums"]["trip_invitation_status"]
          token_hash: string
          trip_id: number
          updated_at: string
        }
        Insert: {
          claimed_profile_id?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: number
          invited_by_id: string
          status?: Database["public"]["Enums"]["trip_invitation_status"]
          token_hash: string
          trip_id: number
          updated_at?: string
        }
        Update: {
          claimed_profile_id?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          invited_by_id?: string
          status?: Database["public"]["Enums"]["trip_invitation_status"]
          token_hash?: string
          trip_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_invitations_claimed_profile_id_fkey"
            columns: ["claimed_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_invitations_invited_by_id_fkey"
            columns: ["invited_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_invitations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_packs: {
        Row: {
          created_at: string | null
          id: number
          pack_id: number | null
          profile_id: string | null
          trip_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          pack_id?: number | null
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          pack_id?: number | null
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_packs_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_packs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_packs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string | null
          description: string | null
          destination_lat: number | null
          destination_lng: number | null
          destination_place_id: string | null
          ending_date: string | null
          ending_point: string | null
          id: number
          locked_at: string | null
          name: string | null
          origin_lat: number | null
          origin_lng: number | null
          origin_place_id: string | null
          profile_id: string | null
          slug: string | null
          starting_date: string | null
          starting_point: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_lat?: number | null
          destination_lng?: number | null
          destination_place_id?: string | null
          ending_date?: string | null
          ending_point?: string | null
          id?: number
          locked_at?: string | null
          name?: string | null
          origin_lat?: number | null
          origin_lng?: number | null
          origin_place_id?: string | null
          profile_id?: string | null
          slug?: string | null
          starting_date?: string | null
          starting_point?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_lat?: number | null
          destination_lng?: number | null
          destination_place_id?: string | null
          ending_date?: string | null
          ending_point?: string | null
          id?: number
          locked_at?: string | null
          name?: string | null
          origin_lat?: number | null
          origin_lng?: number | null
          origin_place_id?: string | null
          profile_id?: string | null
          slug?: string | null
          starting_date?: string | null
          starting_point?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_category_and_item: {
        Args: { p_items: Json; p_name: string; p_pack_id: number }
        Returns: Json
      }
      create_poll: {
        Args: { answers: string[]; question: string; trip_id: number }
        Returns: Json
      }
      get_closet_page_data: { Args: { p_pack_id: number }; Returns: Json }
      get_dashboard_data: { Args: never; Returns: Json }
      get_planning_page_data: { Args: { p_trip_id: number }; Returns: Json }
      grant_beta_lifetime_for_profile: { Args: { p_profile_id: string }; Returns: undefined }
      import_csv_data: {
        Args: { csv_data: Json; p_pack_id: number }
        Returns: Json
      }
      search_profiles: {
        Args: { search_query: string }
        Returns: {
          address_1: string | null
          address_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          deactivated_at: string | null
          email: string
          first_name: string | null
          fts: unknown
          id: string
          image: string | null
          last_name: string | null
          location: Json | null
          measuring_system:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          needs_free_resource_selection: boolean
          onboard_date: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          slug: string
          state: string | null
          trail_name: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_poll: {
        Args: { answers: string[]; poll_id: number; question: string }
        Returns: Json
      }
      update_positions: {
        Args: {
          records: Database["public"]["CompositeTypes"]["category_item_position"][]
        }
        Returns: Json[]
      }
    }
    Enums: {
      friend_request_status: "PENDING" | "ACCEPTED" | "DECLINED"
      item_unit: "g" | "kg" | "oz" | "lb"
      measuring_system: "IMPERIAL" | "METRIC"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      resource_type: "USER" | "GROUP"
      subscription_level: "FREE" | "MONTHLY" | "ANNUAL" | "LIFE"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
      theme:
        | "BLUE6"
        | "BLUEGREEN6"
        | "BREEZE6"
        | "CELESTIAL6"
        | "CIRCUIT6"
        | "DAMASK6"
        | "DEPTH6"
        | "FLOW6"
        | "FORTE6"
        | "GENESIS6"
        | "GRAYSCALE6"
        | "IONBOARDROOM6"
        | "KILTER6"
        | "TABLEAU10"
        | "COLORBLIND10"
        | "JEWELBRIGHT9"
        | "HUECIRCLE19"
      trip_details_type: "HIKE" | "TRIP"
      trip_friend_status: "ACCEPTED" | "DECLINED" | "PENDING"
      trip_invitation_status: "PENDING" | "CLAIMED" | "CANCELED"
      user_role: "ADMIN" | "USER"
    }
    CompositeTypes: {
      category_item_position: {
        category_item_id: number | null
        category_id: number | null
        item_id: number | null
        new_position: number | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
      friend_request_status: ["PENDING", "ACCEPTED", "DECLINED"],
      item_unit: ["g", "kg", "oz", "lb"],
      measuring_system: ["IMPERIAL", "METRIC"],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      resource_type: ["USER", "GROUP"],
      subscription_level: ["FREE", "MONTHLY", "ANNUAL", "LIFE"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
      ],
      theme: [
        "BLUE6",
        "BLUEGREEN6",
        "BREEZE6",
        "CELESTIAL6",
        "CIRCUIT6",
        "DAMASK6",
        "DEPTH6",
        "FLOW6",
        "FORTE6",
        "GENESIS6",
        "GRAYSCALE6",
        "IONBOARDROOM6",
        "KILTER6",
        "TABLEAU10",
        "COLORBLIND10",
        "JEWELBRIGHT9",
        "HUECIRCLE19",
      ],
      trip_details_type: ["HIKE", "TRIP"],
      trip_friend_status: ["ACCEPTED", "DECLINED", "PENDING"],
      trip_invitation_status: ["PENDING", "CLAIMED", "CANCELED"],
      user_role: ["ADMIN", "USER"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const


export enum FriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED"
}

export enum ItemUnit {
  g = "g",
  kg = "kg",
  oz = "oz",
  lb = "lb"
}

export enum MeasuringSystem {
  IMPERIAL = "IMPERIAL",
  METRIC = "METRIC"
}

export enum PricingPlanInterval {
  day = "day",
  week = "week",
  month = "month",
  year = "year"
}

export enum PricingType {
  one_time = "one_time",
  recurring = "recurring"
}

export enum ResourceType {
  USER = "USER",
  GROUP = "GROUP"
}

export enum SubscriptionLevel {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL",
  LIFE = "LIFE"
}

export enum SubscriptionStatus {
  trialing = "trialing",
  active = "active",
  canceled = "canceled",
  incomplete = "incomplete",
  incomplete_expired = "incomplete_expired",
  past_due = "past_due",
  unpaid = "unpaid"
}

export enum Theme {
  BLUE6 = "BLUE6",
  BLUEGREEN6 = "BLUEGREEN6",
  BREEZE6 = "BREEZE6",
  CELESTIAL6 = "CELESTIAL6",
  CIRCUIT6 = "CIRCUIT6",
  DAMASK6 = "DAMASK6",
  DEPTH6 = "DEPTH6",
  FLOW6 = "FLOW6",
  FORTE6 = "FORTE6",
  GENESIS6 = "GENESIS6",
  GRAYSCALE6 = "GRAYSCALE6",
  IONBOARDROOM6 = "IONBOARDROOM6",
  KILTER6 = "KILTER6",
  TABLEAU10 = "TABLEAU10",
  COLORBLIND10 = "COLORBLIND10",
  JEWELBRIGHT9 = "JEWELBRIGHT9",
  HUECIRCLE19 = "HUECIRCLE19"
}

export enum TripDetailsType {
  HIKE = "HIKE",
  TRIP = "TRIP"
}

export enum TripFriendStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  PENDING = "PENDING"
}

export enum TripInvitationStatus {
  PENDING = "PENDING",
  CLAIMED = "CLAIMED",
  CANCELED = "CANCELED"
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}