// Firebase集合名称常量
export const COLLECTIONS = {
  PROJECTS: "project", // 保持与现有数据库一致
  USERS: "users",
} as const;

// 项目相关字段名称常量
export const PROJECT_FIELDS = {
  ID: "id",
  NAME: "name",
  DETAILS: "details",
  DUE_DATE: "dueDate",
  CATEGORY: "category",
  ASSIGNED_USERS_LIST: "assignedUsersList",
  COMMENTS: "comments",
  CREATED_BY: "createdBy",
  CREATED_AT: "createdAt",
} as const;

// 用户相关字段名称常量
export const USER_FIELDS = {
  ID: "id",
  DISPLAY_NAME: "displayName",
  PHOTO_URL: "photoURL",
  EMAIL: "email",
  ONLINE: "online",
  UID: "uid",
} as const;

// 评论相关字段名称常量
export const COMMENT_FIELDS = {
  ID: "id",
  DISPLAY_NAME: "displayName",
  PHOTO_URL: "photoURL",
  CONTENT: "content",
  CREATED_AT: "createdAt",
} as const;

// 项目分类常量
export const PROJECT_CATEGORIES = {
  DEVELOPMENT: "development",
  DESIGN: "design",
  SALES: "sales",
  MARKETING: "marketing",
} as const;

// 过滤器常量
export const PROJECT_FILTERS = {
  ALL: "all",
  MINE: "mine",
  DEVELOPMENT: PROJECT_CATEGORIES.DEVELOPMENT,
  DESIGN: PROJECT_CATEGORIES.DESIGN,
  SALES: PROJECT_CATEGORIES.SALES,
  MARKETING: PROJECT_CATEGORIES.MARKETING,
} as const;

// 导出类型（用于TypeScript类型检查）
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
export type ProjectField = (typeof PROJECT_FIELDS)[keyof typeof PROJECT_FIELDS];
export type UserField = (typeof USER_FIELDS)[keyof typeof USER_FIELDS];
export type CommentField = (typeof COMMENT_FIELDS)[keyof typeof COMMENT_FIELDS];
export type ProjectCategory =
  (typeof PROJECT_CATEGORIES)[keyof typeof PROJECT_CATEGORIES];
export type ProjectFilter =
  (typeof PROJECT_FILTERS)[keyof typeof PROJECT_FILTERS];
