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
      products: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          description: string | null
          image: string | null
          available: boolean
          stock: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          description?: string | null
          image?: string | null
          available?: boolean
          stock?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          description?: string | null
          image?: string | null
          available?: boolean
          stock?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          address: string | null
          delivery_method: 'pickup' | 'delivery'
          payment_method: string
          payment_status: 'pending' | 'paid' | 'failed'
          order_status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          notes: string | null
          pickup_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          address?: string | null
          delivery_method: 'pickup' | 'delivery'
          payment_method: string
          payment_status?: 'pending' | 'paid' | 'failed'
          order_status?: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          notes?: string | null
          pickup_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          address?: string | null
          delivery_method?: 'pickup' | 'delivery'
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed'
          order_status?: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled'
          total_amount?: number
          notes?: string | null
          pickup_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          product_name: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          product_name: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          product_name?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          role: 'admin' | 'owner'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          role?: 'admin' | 'owner'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          role?: 'admin' | 'owner'
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
  }
}
