---
name: qgy-back-rules
description: 后端开发规则中心。提供所有后端开发规范的YAML结构化定义，包括分页、命名、安全、MySQL、ES、MQ、数据清洗等规则。按需加载对应rule文件，支持脚本校验。
argument-hint: "[rule-category]"
---

# qgy-back-rules 后端开发规则中心

本技能提供后端开发规范的**结构化 YAML 定义**，是所有后端规范的**单一真相来源**。

## 规则文件结构

```
rules/
├── pagination.yaml      # 分页规则（页大小限制、遍历限制）
├── naming.yaml         # 命名规则（DTO、MySQL、表命名）
├── security.yaml       # 安全规则（哈希、权限、参数校验）
├── general.yaml        # 通用规则（开发环境、批量操作、变量重构）
├── mysql-table.yaml    # MySQL建表规范
├── mysql-index.yaml   # MySQL索引规范
├── mysql-sql.yaml     # SQL编写规范
├── orm-mapping.yaml   # ORM映射规范（MyBatis）
├── elasticsearch.yaml # ElasticSearch规范
├── mq.yaml            # 消息队列规范
├── input-cleaning.yaml # 输入清洗规范
├── data-cleaning.yaml  # 数据清洗规范
└── import-export.yaml  # 数据导入导出规范
```

## 规则级别

| 级别 | 含义 | 约束力 |
|------|------|--------|
| MANDATORY | 必须遵守 | 最高，违反将导致评审不通过 |
| RECOMMENDED | 强烈建议 | 高，提升质量和性能 |
| REFERENCE | 参考 | 中，可选优化项 |

## 按需加载

**根据任务类型加载对应规则文件：**

| 任务 | 加载规则 | 说明 |
|------|----------|------|
| 接口设计 | `pagination`, `naming` | 页大小限制、DTO命名 |
| 分页查询 | `pagination` | 深分页解决方案 |
| 命名重构 | `naming` | DTO/表/字段命名 |
| 安全审计 | `security` | 哈希算法、权限校验 |
| MySQL设计 | `mysql-table`, `mysql-index` | 建表、索引 |
| SQL编写 | `mysql-sql`, `orm-mapping` | SQL规范、MyBatis |
| ES查询 | `elasticsearch` | 字段映射、导出方案 |
| MQ消费 | `mq` | 幂等性 |
| 数据清洗 | `data-cleaning`, `input-cleaning` | 批次处理、清洗方法 |
| 导入导出 | `import-export` | 执行原则、深分页 |
| 开发环境 | `general` | SQL打印、分片表 |

## 规则查询示例

### 查询分页限制
```bash
# 查看所有分页相关规则
grep -A5 "id: PAGE" rules/pagination.yaml
```

### 查询命名规范
```bash
# 查看DTO命名规则
grep -A3 "category: dto" rules/naming.yaml
```

## 脚本工具

| 脚本 | 用途 |
|------|------|
| `scripts/validate-rules.js` | 校验规则 YAML 格式 |
| `scripts/query-rules.js` | 按关键词查询规则 |

## 扩展规范

**新增规范步骤：**
1. 在 `rules/` 目录创建 `xxx.yaml` 文件
2. 按 `name`, `version`, `rules[]` 结构定义
3. 在 qgy-back-full 的路由表中注册

## 规范同步

其他 skill（qgy-back-api, qgy-back-mysql 等）引用本中心的规则，**不再重复定义**。
