export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      answers: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: number;
          profile_id: string | null;
          question_id: number | null;
          updated_at: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          question_id?: number | null;
          updated_at?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          question_id?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
          pack_id: number | null;
          slug: string;
          unit: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
          pack_id?: number | null;
          slug: string;
          unit?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
          pack_id?: number | null;
          slug?: string;
          unit?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_pack_id_fkey";
            columns: ["pack_id"];
            isOneToOne: false;
            referencedRelation: "packs";
            referencedColumns: ["id"];
          },
        ];
      };
      category_items: {
        Row: {
          category_id: number | null;
          created_at: string | null;
          id: number;
          item_id: number | null;
          position: number | null;
          updated_at: string | null;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string | null;
          id?: number;
          item_id?: number | null;
          position?: number | null;
          updated_at?: string | null;
        };
        Update: {
          category_id?: number | null;
          created_at?: string | null;
          id?: number;
          item_id?: number | null;
          position?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "category_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "category_items_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          created_at: string | null;
          id: number;
          pack_id: number;
          profile_id: string;
          text: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          pack_id: number;
          profile_id: string;
          text?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          pack_id?: number;
          profile_id?: string;
          text?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_pack_id_fkey";
            columns: ["pack_id"];
            isOneToOne: false;
            referencedRelation: "packs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          profile_id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id?: string;
          profile_id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          profile_id?: string;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      friends: {
        Row: {
          created_at: string | null;
          friend_id: string | null;
          id: number;
          invite_accepted_on: string | null;
          invite_sent_on: string | null;
          profile_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          friend_id?: string | null;
          id?: number;
          invite_accepted_on?: string | null;
          invite_sent_on?: string | null;
          profile_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          friend_id?: string | null;
          id?: number;
          invite_accepted_on?: string | null;
          invite_sent_on?: string | null;
          profile_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey";
            columns: ["friend_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      items: {
        Row: {
          consumable: boolean | null;
          created_at: string | null;
          generic_type: string | null;
          id: number;
          name: string | null;
          price: number | null;
          profile_id: string | null;
          quantity: number | null;
          slug: string;
          unit: string | null;
          updated_at: string | null;
          url: string | null;
          weight: string | null;
          worn: boolean | null;
        };
        Insert: {
          consumable?: boolean | null;
          created_at?: string | null;
          generic_type?: string | null;
          id?: number;
          name?: string | null;
          price?: number | null;
          profile_id?: string | null;
          quantity?: number | null;
          slug: string;
          unit?: string | null;
          updated_at?: string | null;
          url?: string | null;
          weight?: string | null;
          worn?: boolean | null;
        };
        Update: {
          consumable?: boolean | null;
          created_at?: string | null;
          generic_type?: string | null;
          id?: number;
          name?: string | null;
          price?: number | null;
          profile_id?: string | null;
          quantity?: number | null;
          slug?: string;
          unit?: string | null;
          updated_at?: string | null;
          url?: string | null;
          weight?: string | null;
          worn?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "items_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: number;
          profile_id: string | null;
          read_on_date: string | null;
          sender_id: string | null;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          read_on_date?: string | null;
          sender_id?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          read_on_date?: string | null;
          sender_id?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_steps: {
        Row: {
          completion_date: string | null;
          created_at: string;
          page: string;
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          completion_date?: string | null;
          created_at?: string;
          page: string;
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          completion_date?: string | null;
          created_at?: string;
          page?: string;
          profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      packs: {
        Row: {
          allow_comments: boolean;
          created_at: string | null;
          id: number;
          name: string | null;
          private: boolean;
          profile_id: string;
          slug: string;
          theme: Database["public"]["Enums"]["theme"] | null;
          updated_at: string | null;
        };
        Insert: {
          allow_comments?: boolean;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          private?: boolean;
          profile_id: string;
          slug: string;
          theme?: Database["public"]["Enums"]["theme"] | null;
          updated_at?: string | null;
        };
        Update: {
          allow_comments?: boolean;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          private?: boolean;
          profile_id?: string;
          slug?: string;
          theme?: Database["public"]["Enums"]["theme"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "packs_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      polls: {
        Row: {
          created_at: string | null;
          id: number;
          profile_id: string | null;
          trip_id: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          trip_id?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          trip_id?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "polls_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "polls_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          environment: string | null;
          id: string;
          identifier: Database["public"]["Enums"]["subscription_level"] | null;
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          environment?: string | null;
          id: string;
          identifier?: Database["public"]["Enums"]["subscription_level"] | null;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          environment?: string | null;
          id?: string;
          identifier?: Database["public"]["Enums"]["subscription_level"] | null;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          active: boolean;
          description: string | null;
          environment: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: Database["public"]["Enums"]["subscription_level"] | null;
        };
        Insert: {
          active?: boolean;
          description?: string | null;
          environment?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: Database["public"]["Enums"]["subscription_level"] | null;
        };
        Update: {
          active?: boolean;
          description?: string | null;
          environment?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: Database["public"]["Enums"]["subscription_level"] | null;
        };
        Relationships: [];
      };
      profile_answers: {
        Row: {
          answer_id: number | null;
          created_at: string | null;
          id: number;
          poll_id: number | null;
          profile_id: string | null;
          updated_at: string;
        };
        Insert: {
          answer_id?: number | null;
          created_at?: string | null;
          id?: number;
          poll_id?: number | null;
          profile_id?: string | null;
          updated_at?: string;
        };
        Update: {
          answer_id?: number | null;
          created_at?: string | null;
          id?: number;
          poll_id?: number | null;
          profile_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_answers_answer_id_fkey";
            columns: ["answer_id"];
            isOneToOne: false;
            referencedRelation: "answers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_answers_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_answers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          address_1: string | null;
          address_2: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          email: string;
          first_name: string | null;
          id: string;
          image: string | null;
          last_name: string | null;
          location: Json | null;
          measuring_system:
            | Database["public"]["Enums"]["measuring_system"]
            | null;
          onboard_date: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          state: string | null;
          subscription_level:
            | Database["public"]["Enums"]["subscription_level"]
            | null;
          trail_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          address_1?: string | null;
          address_2?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          id: string;
          image?: string | null;
          last_name?: string | null;
          location?: Json | null;
          measuring_system?:
            | Database["public"]["Enums"]["measuring_system"]
            | null;
          onboard_date?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          state?: string | null;
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null;
          trail_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address_1?: string | null;
          address_2?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          image?: string | null;
          last_name?: string | null;
          location?: Json | null;
          measuring_system?:
            | Database["public"]["Enums"]["measuring_system"]
            | null;
          onboard_date?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          state?: string | null;
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null;
          trail_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          created_at: string | null;
          id: number;
          poll_id: number | null;
          profile_id: string | null;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          poll_id?: number | null;
          profile_id?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          poll_id?: number | null;
          profile_id?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questions_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "questions_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      replies: {
        Row: {
          comment_id: number;
          created_at: string | null;
          id: number;
          profile_id: string;
          text: string | null;
          updated_at: string | null;
        };
        Insert: {
          comment_id: number;
          created_at?: string | null;
          id?: number;
          profile_id: string;
          text?: string | null;
          updated_at?: string | null;
        };
        Update: {
          comment_id?: number;
          created_at?: string | null;
          id?: number;
          profile_id?: string;
          text?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "replies_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "replies_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      shopping_list_items: {
        Row: {
          completed: boolean;
          created_at: string | null;
          id: number;
          profile_id: string | null;
          quantity: number | null;
          resource_type: Database["public"]["Enums"]["resource_type"];
          title: string | null;
          trip_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          completed?: boolean;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          quantity?: number | null;
          resource_type?: Database["public"]["Enums"]["resource_type"];
          title?: string | null;
          trip_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          completed?: boolean;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          quantity?: number | null;
          resource_type?: Database["public"]["Enums"]["resource_type"];
          title?: string | null;
          trip_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shopping_list_items_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created_at: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          profile_id: string;
          quantity: number | null;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          stripe_subscription_id: string | null;
          trial_end: string | null;
          trial_start: string | null;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          profile_id: string;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          stripe_subscription_id?: string | null;
          trial_end?: string | null;
          trial_start?: string | null;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          profile_id?: string;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          stripe_subscription_id?: string | null;
          trial_end?: string | null;
          trial_start?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey";
            columns: ["price_id"];
            isOneToOne: false;
            referencedRelation: "prices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      todos: {
        Row: {
          completed: boolean;
          created_at: string | null;
          id: number;
          profile_id: string | null;
          resource_type: Database["public"]["Enums"]["resource_type"];
          title: string | null;
          trip_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          completed?: boolean;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          resource_type?: Database["public"]["Enums"]["resource_type"];
          title?: string | null;
          trip_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          completed?: boolean;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          resource_type?: Database["public"]["Enums"]["resource_type"];
          title?: string | null;
          trip_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "todos_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "todos_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_details: {
        Row: {
          created_at: string | null;
          id: number;
          title: string | null;
          trip_id: number | null;
          type: string | null;
          updated_at: string;
          url: string | null;
          value: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          title?: string | null;
          trip_id?: number | null;
          type?: string | null;
          updated_at?: string;
          url?: string | null;
          value?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          title?: string | null;
          trip_id?: number | null;
          type?: string | null;
          updated_at?: string;
          url?: string | null;
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trip_details_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_friends: {
        Row: {
          accepted_invite_on: string | null;
          created_at: string | null;
          id: number;
          profile_id: string | null;
          status: Database["public"]["Enums"]["trip_friend_status"];
          trip_id: number | null;
          updated_at: string;
        };
        Insert: {
          accepted_invite_on?: string | null;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          status?: Database["public"]["Enums"]["trip_friend_status"];
          trip_id?: number | null;
          updated_at?: string;
        };
        Update: {
          accepted_invite_on?: string | null;
          created_at?: string | null;
          id?: number;
          profile_id?: string | null;
          status?: Database["public"]["Enums"]["trip_friend_status"];
          trip_id?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_friends_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_friends_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_packs: {
        Row: {
          created_at: string | null;
          id: number;
          pack_id: number | null;
          profile_id: string | null;
          trip_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          pack_id?: number | null;
          profile_id?: string | null;
          trip_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          pack_id?: number | null;
          profile_id?: string | null;
          trip_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trip_packs_pack_id_fkey";
            columns: ["pack_id"];
            isOneToOne: false;
            referencedRelation: "packs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_packs_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_packs_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          coordinates: Json | null;
          created_at: string | null;
          description: string | null;
          ending_date: string | null;
          ending_point: string | null;
          id: number;
          name: string | null;
          profile_id: string;
          slug: string;
          starting_date: string | null;
          starting_point: string | null;
          updated_at: string;
        };
        Insert: {
          coordinates?: Json | null;
          created_at?: string | null;
          description?: string | null;
          ending_date?: string | null;
          ending_point?: string | null;
          id?: number;
          name?: string | null;
          profile_id: string;
          slug: string;
          starting_date?: string | null;
          starting_point?: string | null;
          updated_at?: string;
        };
        Update: {
          coordinates?: Json | null;
          created_at?: string | null;
          description?: string | null;
          ending_date?: string | null;
          ending_point?: string | null;
          id?: number;
          name?: string | null;
          profile_id?: string;
          slug?: string;
          starting_date?: string | null;
          starting_point?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trips_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      measuring_system: "IMPERIAL" | "METRIC";
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      resource_type: "USER" | "GROUP";
      subscription_level: "FREE" | "MONTHLY" | "ANNUAL" | "LIFE";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid";
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
        | "HUECIRCLE19";
      trip_friend_status: "ACCEPTED" | "DECLINED" | "PENDING";
      trip_invitation_status: "ACCEPTED" | "DECLINED" | "PENDING";
      user_role: "ADMIN" | "USER";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;

// Schema: graphql_public
// Functions
export type ArgsGraphql =
  Database["graphql_public"]["Functions"]["graphql"]["Args"];
export type ReturnTypeGraphql =
  Database["graphql_public"]["Functions"]["graphql"]["Returns"];

// Schema: public
// Enums
export enum MeasuringSystem {
  IMPERIAL = "IMPERIAL",
  METRIC = "METRIC",
}

export enum PricingPlanInterval {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export enum PricingType {
  one_time = "one_time",
  recurring = "recurring",
}

export enum ResourceType {
  USER = "USER",
  GROUP = "GROUP",
}

export enum SubscriptionLevel {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL",
  LIFE = "LIFE",
}

export enum SubscriptionStatus {
  trialing = "trialing",
  active = "active",
  canceled = "canceled",
  incomplete = "incomplete",
  incomplete_expired = "incomplete_expired",
  past_due = "past_due",
  unpaid = "unpaid",
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
  HUECIRCLE19 = "HUECIRCLE19",
}

export enum TripFriendStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  PENDING = "PENDING",
}

export enum TripInvitationStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  PENDING = "PENDING",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

// Tables
export type Answer = Database["public"]["Tables"]["answers"]["Row"];
export type InsertAnswer = Database["public"]["Tables"]["answers"]["Insert"];
export type UpdateAnswer = Database["public"]["Tables"]["answers"]["Update"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type InsertCategory =
  Database["public"]["Tables"]["categories"]["Insert"];
export type UpdateCategory =
  Database["public"]["Tables"]["categories"]["Update"];

export type CategoryItem =
  Database["public"]["Tables"]["category_items"]["Row"];
export type InsertCategoryItem =
  Database["public"]["Tables"]["category_items"]["Insert"];
export type UpdateCategoryItem =
  Database["public"]["Tables"]["category_items"]["Update"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type InsertComment = Database["public"]["Tables"]["comments"]["Insert"];
export type UpdateComment = Database["public"]["Tables"]["comments"]["Update"];

export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type InsertCustomer =
  Database["public"]["Tables"]["customers"]["Insert"];
export type UpdateCustomer =
  Database["public"]["Tables"]["customers"]["Update"];

export type Friend = Database["public"]["Tables"]["friends"]["Row"];
export type InsertFriend = Database["public"]["Tables"]["friends"]["Insert"];
export type UpdateFriend = Database["public"]["Tables"]["friends"]["Update"];

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type InsertItem = Database["public"]["Tables"]["items"]["Insert"];
export type UpdateItem = Database["public"]["Tables"]["items"]["Update"];

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type InsertNotification =
  Database["public"]["Tables"]["notifications"]["Insert"];
export type UpdateNotification =
  Database["public"]["Tables"]["notifications"]["Update"];

export type OnboardingStep =
  Database["public"]["Tables"]["onboarding_steps"]["Row"];
export type InsertOnboardingStep =
  Database["public"]["Tables"]["onboarding_steps"]["Insert"];
export type UpdateOnboardingStep =
  Database["public"]["Tables"]["onboarding_steps"]["Update"];

export type Pack = Database["public"]["Tables"]["packs"]["Row"];
export type InsertPack = Database["public"]["Tables"]["packs"]["Insert"];
export type UpdatePack = Database["public"]["Tables"]["packs"]["Update"];

export type Poll = Database["public"]["Tables"]["polls"]["Row"];
export type InsertPoll = Database["public"]["Tables"]["polls"]["Insert"];
export type UpdatePoll = Database["public"]["Tables"]["polls"]["Update"];

export type Price = Database["public"]["Tables"]["prices"]["Row"];
export type InsertPrice = Database["public"]["Tables"]["prices"]["Insert"];
export type UpdatePrice = Database["public"]["Tables"]["prices"]["Update"];

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type InsertProduct = Database["public"]["Tables"]["products"]["Insert"];
export type UpdateProduct = Database["public"]["Tables"]["products"]["Update"];

export type ProfileAnswer =
  Database["public"]["Tables"]["profile_answers"]["Row"];
export type InsertProfileAnswer =
  Database["public"]["Tables"]["profile_answers"]["Insert"];
export type UpdateProfileAnswer =
  Database["public"]["Tables"]["profile_answers"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type InsertProfile = Database["public"]["Tables"]["profiles"]["Insert"];
export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"];

export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type InsertQuestion =
  Database["public"]["Tables"]["questions"]["Insert"];
export type UpdateQuestion =
  Database["public"]["Tables"]["questions"]["Update"];

export type Reply = Database["public"]["Tables"]["replies"]["Row"];
export type InsertReply = Database["public"]["Tables"]["replies"]["Insert"];
export type UpdateReply = Database["public"]["Tables"]["replies"]["Update"];

export type ShoppingListItem =
  Database["public"]["Tables"]["shopping_list_items"]["Row"];
export type InsertShoppingListItem =
  Database["public"]["Tables"]["shopping_list_items"]["Insert"];
export type UpdateShoppingListItem =
  Database["public"]["Tables"]["shopping_list_items"]["Update"];

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type InsertSubscription =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
export type UpdateSubscription =
  Database["public"]["Tables"]["subscriptions"]["Update"];

export type Todo = Database["public"]["Tables"]["todos"]["Row"];
export type InsertTodo = Database["public"]["Tables"]["todos"]["Insert"];
export type UpdateTodo = Database["public"]["Tables"]["todos"]["Update"];

export type TripDetail = Database["public"]["Tables"]["trip_details"]["Row"];
export type InsertTripDetail =
  Database["public"]["Tables"]["trip_details"]["Insert"];
export type UpdateTripDetail =
  Database["public"]["Tables"]["trip_details"]["Update"];

export type TripFriend = Database["public"]["Tables"]["trip_friends"]["Row"];
export type InsertTripFriend =
  Database["public"]["Tables"]["trip_friends"]["Insert"];
export type UpdateTripFriend =
  Database["public"]["Tables"]["trip_friends"]["Update"];

export type TripPack = Database["public"]["Tables"]["trip_packs"]["Row"];
export type InsertTripPack =
  Database["public"]["Tables"]["trip_packs"]["Insert"];
export type UpdateTripPack =
  Database["public"]["Tables"]["trip_packs"]["Update"];

export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type InsertTrip = Database["public"]["Tables"]["trips"]["Insert"];
export type UpdateTrip = Database["public"]["Tables"]["trips"]["Update"];

// Schema: storage
// Tables
export type Bucket = Database["storage"]["Tables"]["buckets"]["Row"];
export type InsertBucket = Database["storage"]["Tables"]["buckets"]["Insert"];
export type UpdateBucket = Database["storage"]["Tables"]["buckets"]["Update"];

export type Migration = Database["storage"]["Tables"]["migrations"]["Row"];
export type InsertMigration =
  Database["storage"]["Tables"]["migrations"]["Insert"];
export type UpdateMigration =
  Database["storage"]["Tables"]["migrations"]["Update"];

export type Object = Database["storage"]["Tables"]["objects"]["Row"];
export type InsertObject = Database["storage"]["Tables"]["objects"]["Insert"];
export type UpdateObject = Database["storage"]["Tables"]["objects"]["Update"];

// Functions
export type ArgsCanInsertObject =
  Database["storage"]["Functions"]["can_insert_object"]["Args"];
export type ReturnTypeCanInsertObject =
  Database["storage"]["Functions"]["can_insert_object"]["Returns"];

export type ArgsExtension =
  Database["storage"]["Functions"]["extension"]["Args"];
export type ReturnTypeExtension =
  Database["storage"]["Functions"]["extension"]["Returns"];

export type ArgsFilename = Database["storage"]["Functions"]["filename"]["Args"];
export type ReturnTypeFilename =
  Database["storage"]["Functions"]["filename"]["Returns"];

export type ArgsFoldername =
  Database["storage"]["Functions"]["foldername"]["Args"];
export type ReturnTypeFoldername =
  Database["storage"]["Functions"]["foldername"]["Returns"];

export type ArgsGetSizeByBucket =
  Database["storage"]["Functions"]["get_size_by_bucket"]["Args"];
export type ReturnTypeGetSizeByBucket =
  Database["storage"]["Functions"]["get_size_by_bucket"]["Returns"];

export type ArgsSearch = Database["storage"]["Functions"]["search"]["Args"];
export type ReturnTypeSearch =
  Database["storage"]["Functions"]["search"]["Returns"];
