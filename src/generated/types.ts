export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          question_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          question_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          question_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string | null
          pack_id: number | null
          slug: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          pack_id?: number | null
          slug: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          pack_id?: number | null
          slug?: string
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
          }
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
          }
        ]
      }
      comments: {
        Row: {
          created_at: string | null
          id: number
          pack_id: number
          text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          pack_id: number
          text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          pack_id?: number
          text?: string | null
          updated_at?: string | null
          user_id?: string
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
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          stripe_customer_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: number
          invite_accepted_on: string | null
          invite_sent_on: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: number
          invite_accepted_on?: string | null
          invite_sent_on?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: number
          invite_accepted_on?: string | null
          invite_sent_on?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          quantity: number | null
          slug: string
          unit: string | null
          updated_at: string | null
          url: string | null
          user_id: string | null
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
          quantity?: number | null
          slug: string
          unit?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
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
          quantity?: number | null
          slug?: string
          unit?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
          weight?: string | null
          worn?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          read_on_date: string | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          read_on_date?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          read_on_date?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      onboarding_steps: {
        Row: {
          completion_date: string | null
          created_at: string
          page: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          page: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          page?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      packs: {
        Row: {
          allow_comments: boolean
          created_at: string | null
          id: number
          name: string | null
          private: boolean
          slug: string
          theme: Database["public"]["Enums"]["theme"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_comments?: boolean
          created_at?: string | null
          id?: number
          name?: string | null
          private?: boolean
          slug: string
          theme?: Database["public"]["Enums"]["theme"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_comments?: boolean
          created_at?: string | null
          id?: number
          name?: string | null
          private?: boolean
          slug?: string
          theme?: Database["public"]["Enums"]["theme"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "packs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          id: number
          trip_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          trip_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          trip_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          }
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
      questions: {
        Row: {
          created_at: string | null
          id: number
          poll_id: number | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          poll_id?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          poll_id?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      replies: {
        Row: {
          comment_id: number
          created_at: string | null
          id: number
          text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string | null
          id?: number
          text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string | null
          id?: number
          text?: string | null
          updated_at?: string | null
          user_id?: string
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
            foreignKeyName: "replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shopping_list_items: {
        Row: {
          completed: boolean
          created_at: string | null
          id: number
          quantity: number | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          title: string | null
          trip_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: number
          quantity?: number | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: number
          quantity?: number | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
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
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
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
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
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
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      todos: {
        Row: {
          completed: boolean
          created_at: string | null
          id: number
          resource_type: Database["public"]["Enums"]["resource_type"]
          title: string | null
          trip_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: number
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: number
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trip_details: {
        Row: {
          created_at: string | null
          id: number
          title: string | null
          trip_id: number | null
          type: string | null
          updated_at: string
          url: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          title?: string | null
          trip_id?: number | null
          type?: string | null
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string | null
          trip_id?: number | null
          type?: string | null
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
          }
        ]
      }
      trip_friends: {
        Row: {
          accepted_invite_on: string | null
          created_at: string | null
          id: number
          status: Database["public"]["Enums"]["trip_friend_status"]
          trip_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_invite_on?: string | null
          created_at?: string | null
          id?: number
          status?: Database["public"]["Enums"]["trip_friend_status"]
          trip_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_invite_on?: string | null
          created_at?: string | null
          id?: number
          status?: Database["public"]["Enums"]["trip_friend_status"]
          trip_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_friends_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trip_packs: {
        Row: {
          created_at: string | null
          id: number
          pack_id: number | null
          trip_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          pack_id?: number | null
          trip_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          pack_id?: number | null
          trip_id?: number | null
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "trip_packs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_packs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trips: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          description: string | null
          ending_date: string | null
          ending_point: string | null
          id: number
          name: string | null
          slug: string
          starting_date: string | null
          starting_point: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          ending_date?: string | null
          ending_point?: string | null
          id?: number
          name?: string | null
          slug: string
          starting_date?: string | null
          starting_point?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          ending_date?: string | null
          ending_point?: string | null
          id?: number
          name?: string | null
          slug?: string
          starting_date?: string | null
          starting_point?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_answers: {
        Row: {
          answer_id: number | null
          created_at: string | null
          id: number
          poll_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          answer_id?: number | null
          created_at?: string | null
          id?: number
          poll_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          answer_id?: number | null
          created_at?: string | null
          id?: number
          poll_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          address_1: string | null
          address_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          image: string | null
          last_name: string | null
          location: Json | null
          measuring_system:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          onboard_date: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          state: string | null
          subscription_level:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          trail_name: string | null
          updated_at: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          image?: string | null
          last_name?: string | null
          location?: Json | null
          measuring_system?:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          onboard_date?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          trail_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          image?: string | null
          last_name?: string | null
          location?: Json | null
          measuring_system?:
            | Database["public"]["Enums"]["measuring_system"]
            | null
          onboard_date?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          subscription_level?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
          trail_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
      trip_friend_status: "ACCEPTED" | "DECLINED" | "PENDING"
      trip_invitation_status: "ACCEPTED" | "DECLINED" | "PENDING"
      user_role: "ADMIN" | "USER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
