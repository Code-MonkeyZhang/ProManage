# Database Design - The Dojo 项目管理系统

## 概述

这是一个基于 React + Firebase 的项目管理系统，使用 Firestore 作为 NoSQL 数据库，Firebase Storage 用于文件存储，Firebase Authentication 用于用户认证。

## 数据库架构

### 1. Users 集合 (`/users/{user_id}`)

用户集合存储注册用户的基本信息和在线状态。

**文档结构：**

```javascript
{
  id: "user_uid",  // 文档ID，对应Firebase Auth的用户UID
  displayName: "用户显示名称",
  photoURL: "用户头像URL",
  online: true // 用户在线状态 (boolean)
}
```

**字段说明：**

- `id`: 文档 ID，自动使用 Firebase Auth 的用户 UID
- `displayName`: 用户显示名称，用于界面展示
- `photoURL`: 用户头像的 Firebase Storage 下载 URL
- `online`: 布尔值，表示用户当前是否在线

**权限规则：**

- 任何已认证用户可以读取和创建用户文档
- 只有用户本人（user_id 与 UID 相同）可以更新自己的文档

### 2. Project 集合 (`/project/{project_id}`)

项目集合存储所有项目的详细信息，包括任务分配、评论等。

**文档结构：**

```javascript
{
  id: "auto_generated_id",  // Firestore自动生成的文档ID
  name: "项目名称",
  details: "项目详细描述",
  category: "development|design|sales|marketing",  // 项目分类
  dueDate: Timestamp,  // Firebase Timestamp对象
  createdAt: Timestamp,  // 创建时间戳
  createdBy: {
    id: "创建者用户ID",
    displayName: "创建者显示名称",
    photoURL: "创建者头像URL"
  },
  assignedUsersList: [
    {
      id: "分配用户ID",
      displayName: "分配用户显示名称",
      photoURL: "分配用户头像URL"
    }
    // ... 更多分配的用户
  ],
  comments: [
    {
      id: "随机生成ID",  // Math.random() 生成（临时方案）
      displayName: "评论者显示名称",
      photoURL: "评论者头像URL",
      content: "评论内容",
      createdAt: Timestamp  // 评论创建时间
    }
    // ... 更多评论
  ]
}
```

**字段说明：**

- `name`: 项目名称
- `details`: 项目详细描述
- `category`: 项目分类，限定为四个值之一
- `dueDate`: 项目截止日期，使用 Firebase Timestamp
- `createdAt`: 项目创建时间，自动添加
- `createdBy`: 项目创建者信息对象
- `assignedUsersList`: 分配给项目的用户列表数组
- `comments`: 项目评论数组，支持嵌套评论系统

**权限规则：**

- 任何已认证用户可以读取、创建和更新项目文档
- 只有项目创建者可以删除项目

## Firebase Storage 结构

### 用户头像存储

**存储路径：**

```
/thumbnails/{user_uid}/{filename}
```

**说明：**

- 每个用户的头像存储在以其 UID 命名的文件夹中
- 支持常见图片格式
- 上传后获取下载 URL 存储到用户文档中

## 数据关系

### 用户与项目关系

- **一对多关系**: 一个用户可以创建多个项目
- **多对多关系**: 一个项目可以分配给多个用户，一个用户可以被分配到多个项目

### 项目与评论关系

- **一对多关系**: 一个项目可以有多个评论
- 评论作为嵌套数组存储在项目文档中，而非独立集合

## 索引配置

当前项目使用默认索引配置：

```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

## 查询模式

### 常用查询

1. **获取所有项目**: `collection("project")`
2. **获取单个项目**: `collection("project").doc(id)`
3. **获取所有用户**: `collection("users")`
4. **实时监听项目变化**: 使用 `onSnapshot` 监听器

### 过滤查询

项目支持以下过滤方式：

- **全部项目**: 不使用过滤器
- **我的项目**: 前端过滤 `assignedUsersList` 包含当前用户
- **按分类过滤**: 前端过滤 `category` 字段

## 安全规则摘要

1. **用户集合**:

   - 读取/创建: 需要用户认证
   - 更新: 仅限用户本人

2. **项目集合**:

   - 读取/创建/更新: 需要用户认证
   - 删除: 仅限项目创建者

3. **存储规则**: 当前禁用所有读写操作

## 技术栈

- **数据库**: Firestore (NoSQL)
- **存储**: Firebase Storage
- **认证**: Firebase Authentication
- **前端**: React.js
- **状态管理**: React Context + useReducer
- **实时更新**: Firestore 实时监听器

## 优化建议

1. **评论 ID 生成**: 使用更可靠的 ID 生成方案替代 `Math.random()`
2. **复合索引**: 根据查询需求添加复合索引
3. **分页**: 对大量项目数据实现分页加载
4. **存储规则**: 完善 Storage 安全规则，允许已认证用户上传头像
