export interface ApiResponse<response> {
  success: boolean
  message: string
  result: response
  status:any
}

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
}

export interface ModalResponse<> {
  visible: boolean
  title: string
  body: React.ReactNode;
  className:string,
  alignment:string
}