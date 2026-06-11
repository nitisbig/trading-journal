export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      trades: {
        Row: {
          created_at: string
          deleted_at: string | null
          direction: string
          entry_at: string
          entry_price: number
          exit_at: string | null
          exit_price: number | null
          id: string
          notes: string | null
          pnl: number | null
          quantity: number
          setup_type: string | null
          strategy: string | null
          symbol: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          direction: string
          entry_at: string
          entry_price: number
          exit_at?: string | null
          exit_price?: number | null
          id?: string
          notes?: string | null
          pnl?: number | null
          quantity: number
          setup_type?: string | null
          strategy?: string | null
          symbol: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          direction?: string
          entry_at?: string
          entry_price?: number
          exit_at?: string | null
          exit_price?: number | null
          id?: string
          notes?: string | null
          pnl?: number | null
          quantity?: number
          setup_type?: string | null
          strategy?: string | null
          symbol?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      hard_delete_trade: { Args: { p_id: string }; Returns: undefined }
      restore_trade: { Args: { p_id: string }; Returns: undefined }
      soft_delete_trade: { Args: { p_id: string }; Returns: undefined }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type TradeRow = Database["public"]["Tables"]["trades"]["Row"]
export type TradeInsert = Database["public"]["Tables"]["trades"]["Insert"]
export type TradeUpdate = Database["public"]["Tables"]["trades"]["Update"]

export type TradeDirection = "long" | "short"

/** App-facing trade shape: nullable DB columns become optional/undefined. */
export interface Trade {
  id: string
  user_id: string
  symbol: string
  direction: TradeDirection
  entry_price: number
  exit_price?: number
  quantity: number
  entry_at: string
  exit_at?: string
  pnl?: number
  strategy?: string
  setup_type?: string
  notes?: string
  tags?: string[]
  created_at: string
}
