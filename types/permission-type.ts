// types/permission-type.ts
export type PermissionAction = 'read' | 'create' | 'update' | 'delete';

export type PermissionKey =
  | 'post:create'
  | 'post:update'
  | 'post:delete'
  | 'post:read';
