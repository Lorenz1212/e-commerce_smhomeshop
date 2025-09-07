export type InventoryMovementReportModel = {
  id: number
  product: {name:string}
  supplier: {name:string}
  quantity: number
  movement_type: 'IN' | 'OUT'
  created_at_format: string
}