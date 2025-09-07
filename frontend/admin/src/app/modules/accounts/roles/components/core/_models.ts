export interface RoleModel {
    row_number:number,
    id_encrypted:string,
    name:string,
    permissionParents:[]|undefined,
    created_at:string
}