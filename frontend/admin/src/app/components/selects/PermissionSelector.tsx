import { FC, useEffect, useState } from 'react'
import { fetchData } from '@@@@@/permissionService'

interface PermissionItem {
  id: number
  name: string
}

interface PermissionGroup {
  id: number
  label: string
  permissions: PermissionItem[]
}

interface Props {
  selected: number[]
  onChange: (selected: number[]) => void
}

const PermissionSelector: FC<Props> = ({ selected, onChange }) => {
  const [permissionsList, setPermissionsList] = useState<PermissionGroup[]>([])
  const [dependencies, setDependencies] = useState<Record<number, number[]>>({})
  const [childToParent, setChildToParent] = useState<Record<number, number>>({})

  useEffect(() => {
    fetchData()
      .then((data) => {
        const mapped: PermissionGroup[] = data.map((item: any) => ({
          id: item.id,
          label: item.name,
          permissions: item.permissions || [],
        }))
        setPermissionsList(mapped)

        // Build dependency map
        const deps: Record<number, number[]> = {}
        const ctp: Record<number, number> = {}

        mapped.forEach((group) => {
          const parent = group.permissions.find(
            (p) => p.name.toLowerCase() === 'view list'
          )

          if (parent) {
            const children = group.permissions
              .filter((p) => p.id !== parent.id)
              .map((p) => p.id)

            deps[parent.id] = children
            children.forEach((child) => {
              ctp[child] = parent.id
            })
          }
        })

        setDependencies(deps)
        setChildToParent(ctp)
      })
      .catch(console.error)
  }, [])

  const togglePermission = (id: number) => {
    let newSelected = [...selected]

    if (newSelected.includes(id)) {
      // uncheck this permission
      newSelected = newSelected.filter((pid) => pid !== id)

      // if it's a parent, also remove all children
      if (dependencies[id]) {
        newSelected = newSelected.filter((pid) => !dependencies[id].includes(pid))
      }
    } else {
      // check this permission
      newSelected.push(id)

      // if it's a child, auto-check parent
      if (childToParent[id]) {
        newSelected.push(childToParent[id])
      }
    }

    onChange([...new Set(newSelected)])
  }

  const toggleGroupPermissions = (permissions: PermissionItem[]) => {
    const ids = permissions.map((p) => p.id)
    const allSelected = ids.every((id) => selected.includes(id))

    if (allSelected) {
      // Unselect all in this group + all their children
      const toRemove = new Set<number>()
      ids.forEach((id) => {
        toRemove.add(id)
        if (dependencies[id]) {
          dependencies[id].forEach((child) => toRemove.add(child))
        }
      })

      const newSelected = selected.filter((id) => !toRemove.has(id))
      onChange(newSelected)
    } else {
      // Select all in this group (merge unique)
      const newSelected = [...new Set([...selected, ...ids])]
      onChange(newSelected)
    }
  }

  return (
    <div>
      <label className="form-label">Permissions</label>
      <div className="row">
        {permissionsList.map((group) => {
          const ids = group.permissions.map((p) => p.id)
          const allSelected = ids.every((id) => selected.includes(id))
          const someSelected = ids.some((id) => selected.includes(id))

          return (
            <div key={group.id} className="col-md-4 mb-3">
              <div className="card shadow p-3 h-100">
                <div className="form-check mb-5">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`group-${group.id}`}
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = !allSelected && someSelected
                      }
                    }}
                    onChange={() => toggleGroupPermissions(group.permissions)}
                  />
                  <label className="form-check-label fw-bold" htmlFor={`group-${group.id}`}>
                    {group.label}
                  </label>
                </div>

                {group.permissions.map((perm) => (
                  <div key={perm.id} className="form-check ms-8 mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`perm-${perm.id}`}
                      checked={selected.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                    />
                    <label className="form-check-label" htmlFor={`perm-${perm.id}`}>
                      {perm.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { PermissionSelector }
