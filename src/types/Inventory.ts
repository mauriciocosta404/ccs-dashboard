export interface InventoryResponse {
  patrimonyNumber: string;      // N.Patrimonio
  assetName: string;            // Nome do Bem
  category: string;             // Categoria
  totalEntries: number;         // Total de Entradas
  totalExits: number;           // Total de Saídas
  currentBalance: number;       // Saldo Actual
  condition: string;            // Situação
  observations?: string;        // Observação
}



