import { useState, useEffect, useRef, useMemo } from 'react'
import debounce from 'lodash/debounce'
import { PaginatedResponse } from '@@@@/types'
import api from '@@@@/api'

export const useTableHook = <Model>(url: string,extra_filter:any|boolean = false) => {
  const [data, setData] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [search, _setSearch] = useState('') // for UI display only
  const searchRef = useRef('') // holds real search term used in fetch

  const [refreshTable, setRefreshTable] = useState(false)
  
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  })

  const getList = async (
    params: any
  ): Promise<PaginatedResponse<Model>> => {
    const response = await api.get<PaginatedResponse<Model>>(url, {
      params,
    })
    return response.data
  }

  const fetchTable = async () => {
    setLoading(true)
    try {
      const res = await getList({
        page,
        sortColumn,
        sortDirection,
        pageSize: pagination.per_page ?? 10,
        search: searchRef.current,
        extra_filter: extra_filter
      })
      setData(res.data)
      setPagination(res.pagination)
    } catch (err) {
      
    } finally {
      setLoading(false)
    }
  }

  // Debounced fetch
  const debouncedFetch = useMemo(() => debounce(fetchTable, 500), [
    page,
    sortColumn,
    sortDirection,
    pagination?.per_page,
  ])

  // Whenever page, sort, or refresh changes, refetch immediately
  useEffect(() => {
    if (extra_filter === false) {
      fetchTable()
      if (refreshTable) setRefreshTable(false)
    } else {
      if(!extra_filter) return;
      fetchTable()
      if (extra_filter) setRefreshTable(false)
    }
  }, [page, sortColumn, sortDirection, refreshTable,extra_filter])



  const setSearch = (value: string) => {
    _setSearch(value)
    searchRef.current = value
    setPage(1) 
    debouncedFetch()
  }

  return {
    data,
    loading,
    page,
    sortColumn,
    sortDirection,
    pagination,
    search,             // bind this to your input value
    setPage,
    setSortColumn,
    setSortDirection,
    setSearch,          // use this onChange
    refreshTable,
    setRefreshTable,
  }
}