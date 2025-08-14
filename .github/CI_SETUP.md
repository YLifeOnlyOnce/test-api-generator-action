# CI/CD 配置指南

本项目包含自动化的 CI/CD 流水线，当 OpenAPI 规范文件发生变更时，会自动生成 API 客户端代码并发布到 npm。

## 功能特性

- 🚀 **自动触发**: 当 `specs/` 目录中的 YAML/JSON 文件变更时自动触发
- 🔨 **自动构建**: 自动构建项目和生成的 API 客户端代码
- 📦 **自动发布**: 自动发布生成的包到 npm 仓库
- 🏷️ **版本管理**: 自动更新版本号并创建 Git 标签
- 📋 **构建产物**: 保存生成的代码作为构建产物

## 设置步骤

### 1. 配置 npm 访问令牌

在 GitHub 仓库设置中添加以下 Secret：

- `NPM_TOKEN`: 你的 npm 访问令牌

获取 npm 令牌的步骤：
```bash
# 登录 npm
npm login

# 创建访问令牌
npm token create --access public
```

### 2. 配置生成的包信息

编辑 `src/generator.ts` 中的包配置：

```typescript
private async generatePackageJson(): Promise<GeneratedFile> {
  const packageJson = {
    name: "your-api-client-name",  // 修改为你的包名
    version: "1.0.0",
    description: "Generated API client",
    // ... 其他配置
  };
}
```

### 3. 更新 OpenAPI 规范

将你的 OpenAPI 规范文件放在 `specs/` 目录中：

```
specs/
├── api-v1.yaml
├── api-v2.yaml
└── ...
```

## 工作流程

### 触发条件

- **Push 到主分支**: 当推送包含 `specs/` 目录变更的提交到 `main` 或 `master` 分支
- **Pull Request**: 当创建包含 `specs/` 目录变更的 PR

### 执行步骤

1. **检出代码**: 获取最新代码
2. **设置环境**: 安装 Node.js 18
3. **安装依赖**: 运行 `npm ci`
4. **构建项目**: 运行 `npm run build`
5. **生成代码**: 运行 `npm run generate`
6. **构建生成的包**: 在 `generated/` 目录中构建
7. **运行测试**: 如果存在测试则运行
8. **发布包**: 仅在主分支上发布到 npm
9. **创建标签**: 创建版本标签
10. **上传产物**: 保存生成的代码

## 本地脚本

项目包含以下 CI 相关脚本：

```bash
# 构建并生成代码
npm run ci:build

# 发布生成的包
npm run ci:publish

# 完整的 CI 流程
npm run ci:full
```

## 版本管理

项目使用语义化版本控制 (Semantic Versioning)。版本号格式为 `MAJOR.MINOR.PATCH`。

### 自动版本管理

GitHub Actions 会在每次推送到 main/master 分支时自动处理版本更新：

1. **代码生成阶段**：生成器会检查现有的 `package.json` 文件并保持当前版本号
2. **发布阶段**：GitHub Actions 自动执行 `npm version patch` 来递增版本号
3. **提交阶段**：新版本号会被提交回仓库

### 手动版本管理

如果需要手动控制版本号，可以在生成的包中使用以下脚本：
```bash
# 增加 patch 版本 (1.0.0 → 1.0.1)
npm run version:patch

# 增加 minor 版本 (1.0.0 → 1.1.0)
npm run version:minor

# 增加 major 版本 (1.0.0 → 2.0.0)
npm run version:major
```

### 版本管理工作流程

1. 开发者修改 OpenAPI 规范文件
2. 推送到 main/master 分支触发 CI
3. CI 生成新的 API 代码（保持现有版本号）
4. CI 自动递增 patch 版本号
5. CI 发布新版本到 npm
6. CI 将版本变更提交回仓库

## 故障排除

### 常见问题

1. **npm 发布失败**
   - 检查 `NPM_TOKEN` 是否正确设置
   - 确认包名未被占用
   - 检查包访问权限设置

2. **构建失败**
   - 检查 OpenAPI 规范文件格式
   - 确认所有依赖已正确安装
   - 查看构建日志中的具体错误

3. **版本冲突**
   - 手动更新 `generated/package.json` 中的版本号
   - 或删除 npm 上的对应版本

4. **ESM/CommonJS 兼容性错误**
   - 如果遇到 `ERR_REQUIRE_ESM` 错误，通常是因为依赖包版本不兼容
   - 确保使用 chalk v4.x 而不是 v5.x（v5+ 仅支持 ESM）
   - 检查 package.json 中的依赖版本是否正确

5. **HTML 转义错误**
   - 如果生成的 TypeScript 代码中出现 `Record&lt;string, any&gt;` 等 HTML 转义字符
   - 错误信息：`Unexpected "&"` 或 `Property or signature expected`
   - 解决方案：在 `src/generator.ts` 中修改 Handlebars helper：
     ```typescript
     Handlebars.registerHelper("toTypeScript", (schema: Schema) => {
       return new Handlebars.SafeString(schemaToTypeScript(schema));
     });
     ```

### 调试步骤

1. 查看 GitHub Actions 日志
2. 本地运行 `npm run ci:full` 测试
3. 检查生成的 `generated/` 目录内容
4. 验证 OpenAPI 规范文件有效性

## 自定义配置

### 修改触发条件

编辑 `.github/workflows/ci.yml` 中的 `on` 部分：

```yaml
on:
  push:
    paths:
      - 'specs/**/*.yaml'
      - 'src/**/*.ts'  # 添加其他触发路径
```

### 添加测试步骤

在生成的包中添加测试：

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

### 多环境发布

配置不同分支发布到不同环境：

```yaml
- name: Publish to npm (staging)
  if: github.ref == 'refs/heads/develop'
  run: npm publish --tag beta
```