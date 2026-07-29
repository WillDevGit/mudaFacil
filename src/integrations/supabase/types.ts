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
      cidades: {
        Row: {
          estado: string
          id: number
          nome: string
        }
        Insert: {
          estado: string
          id?: number
          nome: string
        }
        Update: {
          estado?: string
          id?: number
          nome?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cidade_id: number | null
          codigo: number
          cpf: string
          endereco: string | null
          nome: string
          rg: string | null
        }
        Insert: {
          cidade_id?: number | null
          codigo?: number
          cpf: string
          endereco?: string | null
          nome: string
          rg?: string | null
        }
        Update: {
          cidade_id?: number | null
          codigo?: number
          cpf?: string
          endereco?: string | null
          nome?: string
          rg?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          endereco: string
          id: number
          nome: string
        }
        Insert: {
          endereco: string
          id?: number
          nome: string
        }
        Update: {
          endereco?: string
          id?: number
          nome?: string
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          cpf: string
          empresa_id: number | null
          endereco: string | null
          nome: string | null
          rg: string | null
          salario: number | null
          telefone: string | null
          tipo: string | null
        }
        Insert: {
          cpf: string
          empresa_id?: number | null
          endereco?: string | null
          nome?: string | null
          rg?: string | null
          salario?: number | null
          telefone?: string | null
          tipo?: string | null
        }
        Update: {
          cpf?: string
          empresa_id?: number | null
          endereco?: string | null
          nome?: string | null
          rg?: string | null
          salario?: number | null
          telefone?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      guindastes: {
        Row: {
          altura: number | null
          bonus: number | null
          servico_id: number
          tamanho_base: number | null
        }
        Insert: {
          altura?: number | null
          bonus?: number | null
          servico_id: number
          tamanho_base?: number | null
        }
        Update: {
          altura?: number | null
          bonus?: number | null
          servico_id?: number
          tamanho_base?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guindastes_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: true
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          acrescimo: number | null
          bonus: number | null
          data_fim: string | null
          id: number
          pedido_id: number
          preco: number | null
          servico_id: number
          tempo_duracao: number | null
        }
        Insert: {
          acrescimo?: number | null
          bonus?: number | null
          data_fim?: string | null
          id?: number
          pedido_id: number
          preco?: number | null
          servico_id: number
          tempo_duracao?: number | null
        }
        Update: {
          acrescimo?: number | null
          bonus?: number | null
          data_fim?: string | null
          id?: number
          pedido_id?: number
          preco?: number | null
          servico_id?: number
          tempo_duracao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "itens_pedido_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      oferecem: {
        Row: {
          empresa_id: number
          id: number
          servico_id: number
        }
        Insert: {
          empresa_id: number
          id?: number
          servico_id: number
        }
        Update: {
          empresa_id?: number
          id?: number
          servico_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "oferecem_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oferecem_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          aceito: boolean | null
          cidade_destino: number | null
          cidade_partida: number | null
          cliente_id: number
          codigo: number
          data_resolucao: string | null
          data_solicitacao: string | null
          empresa_id: number
          endereco_destino: string | null
          endereco_partida: string | null
          funcionario_cpf: string | null
          preco_total: number | null
        }
        Insert: {
          aceito?: boolean | null
          cidade_destino?: number | null
          cidade_partida?: number | null
          cliente_id: number
          codigo?: number
          data_resolucao?: string | null
          data_solicitacao?: string | null
          empresa_id: number
          endereco_destino?: string | null
          endereco_partida?: string | null
          funcionario_cpf?: string | null
          preco_total?: number | null
        }
        Update: {
          aceito?: boolean | null
          cidade_destino?: number | null
          cidade_partida?: number | null
          cliente_id?: number
          codigo?: number
          data_resolucao?: string | null
          data_solicitacao?: string | null
          empresa_id?: number
          endereco_destino?: string | null
          endereco_partida?: string | null
          funcionario_cpf?: string | null
          preco_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cidade_destino_fkey"
            columns: ["cidade_destino"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_cidade_partida_fkey"
            columns: ["cidade_partida"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_funcionario_cpf_fkey"
            columns: ["funcionario_cpf"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["cpf"]
          },
        ]
      }
      servicos: {
        Row: {
          id: number
          nome: string | null
          preco_hora: number
          tipo: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
          preco_hora: number
          tipo?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
          preco_hora?: number
          tipo?: string | null
        }
        Relationships: []
      }
      telefones_cliente: {
        Row: {
          cliente_id: number
          id: number
          telefone: string | null
        }
        Insert: {
          cliente_id: number
          id?: number
          telefone?: string | null
        }
        Update: {
          cliente_id?: number
          id?: number
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telefones_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["codigo"]
          },
        ]
      }
      telefones_empresa: {
        Row: {
          empresa_id: number
          id: number
          telefone: string
        }
        Insert: {
          empresa_id: number
          id?: number
          telefone: string
        }
        Update: {
          empresa_id?: number
          id?: number
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "telefones_empresa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      transportes: {
        Row: {
          limite_carga: number | null
          percentual_acrescimo: number | null
          servico_id: number
        }
        Insert: {
          limite_carga?: number | null
          percentual_acrescimo?: number | null
          servico_id: number
        }
        Update: {
          limite_carga?: number | null
          percentual_acrescimo?: number | null
          servico_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "transportes_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: true
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
