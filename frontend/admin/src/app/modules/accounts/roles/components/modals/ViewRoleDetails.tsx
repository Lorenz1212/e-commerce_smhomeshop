import { FC } from 'react'

interface PermissionItem {
  id: number
  name: string
}

interface PermissionGroup {
  id: number
  name: string
  permissions: PermissionItem[]
}

interface Props {
  data: {
    name: string
    permissions: PermissionGroup[]
  }
}

const ViewRoleDetailsModal: FC<Props> = ({ data }) => {
  return (
    <div className="p-4">
      {/* Role Name */}
      <div className="mb-4">
        <div className="">Role Name: <span className='fw-semibold fs-4'>{data.name}</span></div>
      </div>

      {/* Permissions */}
      <div>
        <h6 className="text-muted mb-3">Permissions</h6>
        <div className="row g-3">
          {data.permissions.map((group) => (
            <div key={group.id} className="col-md-6 col-lg-4">
              <div className="card shadow h-100 border-0">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">{group.name}</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {group.permissions.map((perm) => (
                      <span
                        key={perm.id}
                        className="badge bg-primary bg-opacity-75 text-white rounded-pill px-3 py-2"
                      >
                        {perm.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {data.permissions.length === 0 && (
            <div className="col-12">
              <div className="alert alert-secondary mb-0">
                No permissions assigned to this role.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ViewRoleDetailsModal }
