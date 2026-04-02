# qgy-back 后端开发规范集

基于 [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 的成熟架构设计的**规则中心 + 动态路由**模式后端开发规范集。

---

## 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [核心概念](#核心概念)
- [工作原理](#工作原理)
- [使用指南](#使用指南)
- [注意事项](#注意事项)
- [扩展指南](#扩展指南)

---

## 快速开始

### 触发 Skill

在 Claude Code 中使用以下命令：

```bash
# 完整规范（动态路由）
/qgy-back-full "设计一个订单表"
/qgy-back-full "分页查询优化"
/qgy-back-full "数据清洗 Mapper隔离"

/# 单领域规范
/qgy-back-mysql "设计商品表"
/qgy-back-api "接口分页限制"
/qgy-back-data "数据清洗批次"
```

### 触发关键词

当用户提到以下场景时，自动加载对应规范：

| 关键词 | 加载规范 |
|--------|---------|
| 接口设计、分页 | pagination, naming |
| MySQL、建表、索引 | mysql-table, mysql-index |
| ES查询、Scroll | elasticsearch |
| MQ消费、幂等 | mq |
| 数据清洗 | data-cleaning, input-cleaning |
| 安全、哈希、权限 | security |

---

## 项目结构

```
qgy-back/
├── qgy-back-rules/              # ★ 规则中心（单一真相来源）
│   ├── SKILL.md                # 入口文档
│   ├── rules/                  # YAML 规则定义
│   │   ├── pagination.yaml     # 分页规则
│   │   ├── naming.yaml        # 命名规则
│   │   ├── security.yaml      # 安全规则
│   │   ├── general.yaml       # 通用规范
│   │   ├── mysql-table.yaml  # MySQL建表
│   │   ├── mysql-index.yaml   # MySQL索引
│   │   ├── mysql-sql.yaml     # SQL编写
│   │   ├── orm-mapping.yaml  # ORM映射
│   │   ├── elasticsearch.yaml # ES规范
│   │   ├── mq.yaml           # MQ规范
│   │   ├── input-cleaning.yaml   # 输入清洗
│   │   ├── data-cleaning.yaml    # 数据清洗
│   │   └── import-export.yaml    # 导入导出
│   ├── data/                  # 决策矩阵（CSV）
│   │   ├── scenario-rules.csv    # 场景→规则路由
│   │   ├── pagination-matrix.csv # 分页限制矩阵
│   │   └── field-type-mapping.csv # 字段类型映射
│   └── scripts/               # 工具脚本
│       └── query-rules.js     # 路由查询脚本
│
├── qgy-back-full/              # ★ 动态路由入口
│   └── SKILL.md               # 路由表 + 规范速查
│
├── qgy-back-api/              # 接口规范（引用 rules）
├── qgy-back-common/            # 通用规范（引用 rules）
├── qgy-back-data/              # 数据处理（引用 rules）
├── qgy-back-export/            # 导出日志（引用 rules）
├── qgy-back-mysql/             # MySQL设计（引用 rules）
└── qgy-back-storage/           # 存储层（引用 rules）
```

---

## 核心概念

### 1. 规则中心 (qgy-back-rules)

**所有规范的单一真相来源**，采用 **YAML 结构化定义**：

```yaml
# rules/pagination.yaml 示例
name: 分页规范
version: 1.0.0
rules:
  - id: PAGE-001
    level: MANDATORY      # MANDATORY / RECOMMENDED / REFERENCE
    category: frontend
    description: 前端接口页大小禁止大于100，推荐值为10
    check:
      type: MAX_VALUE
      field: pageSize
      max: 100
      recommend: 10
```

### 2. 动态路由 (qgy-back-full)

根据用户输入的**关键词**，自动匹配对应的规则：

| 关键词 | → | 加载规则 | → | 加载Skill |
|--------|---|----------|---|-----------|
| "设计订单表" | → | mysql-table | → | qgy-back-mysql |
| "分页限制" | → | pagination | → | qgy-back-api |

### 3. 决策矩阵 (CSV)

```csv
# data/scenario-rules.csv
关键词,场景,加载规则,加载Skill
表设计,MySQL,mysql-table,qgy-back-mysql
索引设计,MySQL,mysql-index,qgy-back-mysql
分页查询,分页,pagination,qgy-back-api
```

---

## 工作原理

### 流程图

```
用户输入: "帮我设计一个订单表"
           ↓
    qgy-back-full 检测关键词
           ↓
    查询 scenario-rules.csv 路由表
           ↓
    匹配: 表设计 → mysql-table
           ↓
    读取 qgy-back-rules/rules/mysql-table.yaml
           ↓
    输出规范 + 示例 + 检查清单
```

### 规则级别

| 级别 | 标识 | 含义 | 约束力 |
|------|------|------|--------|
| MANDATORY | 🔴 | 必须遵守 | 最高，违反导致评审不通过 |
| RECOMMENDED | 🟡 | 强烈建议 | 高，提升质量和性能 |
| REFERENCE | 🔵 | 参考 | 中，可选优化项 |

### 规则结构

每个 YAML 规则文件包含：

```yaml
name: 规则名称
version: 版本号
updated: 更新日期
rules:
  - id: RULE-XXX           # 规则ID
    level: MANDATORY        # 级别
    category: category      # 分类
    description: 描述       # 规则描述
    check:                  # 检查条件（可选）
    example:                # 示例（可选）
    apply:                  # 适用范围
```

---

## 使用指南

### 场景 1：设计 MySQL 表

```bash
/qgy-back-mysql "设计一个商品表"
```

输出：
- 建表规范（必备字段、字段类型、字符集）
- 索引设计（索引类型、命名规范）
- 字段类型建议（金额用 DECIMAL、布尔用 TINYINT）

### 场景 2：接口分页限制

```bash
/qgy-back-api "分页查询最大多少"
```

输出：
- 前端接口最大 100，推荐 10
- 深分页最大 100
- 导出深分页最大 500
- 超出限制的申请流程

### 场景 3：数据清洗

```bash
/qgy-back-data "数据清洗 Mapper隔离"
```

输出：
- Mapper 必须与业务 SQL 隔离
- 批次大小选择（1-500条）
- 执行时间要求（晚上低峰期）
- 循环单条查询的危害

### 场景 4：完整后端规范

```bash
/qgy-back-full "后端开发完整规范"
```

输出：
- 所有规则的 MANDATORY 速查表
- 规则中心结构
- 扩展指南

---

## 注意事项

### ⚠️ 规则级别说明

| 级别 | 使用场景 |
|------|---------|
| **MANDATORY** | 代码评审必须检查，违反直接打回 |
| **RECOMMENDED** | 评审建议，优先采纳 |
| **REFERENCE** | 视情况选用，需要时再查 |

### ⚠️ 分页限制

| 类型 | 最大值 | 推荐值 | 超出限制 |
|------|--------|--------|---------|
| 前端接口 | 100 | 10 | 必须向技术主管申请 |
| 普通深分页 | 100 | - | 必须向技术主管申请 |
| 导出深分页 | 500 | - | 必须向技术主管申请 |

### ⚠️ Mapper 隔离

数据清洗的 SQL **必须**与业务 SQL 隔离：

```
✅ 正确：创建独立的 Mapper 文件，如 XxxCleanMapper.xml
❌ 错误：在业务 Mapper 中混入清洗 SQL
```

### ⚠️ ES 导出方案

| 场景 | 方案 | 规则ID |
|------|------|--------|
| 高频导出（如用户） | SearchAfter + PIT | ES-101 |
| 一般导出（如后台） | Scroll | ES-102 |
| 数据量 > 1万 | 必须处理深分页 | ES-201 |

### ⚠️ 哈希算法

| 场景 | 算法 | 规则ID |
|------|------|--------|
| Token 哈希 | HMAC512 | SEC-001 |
| 密码哈希 | SHA256 | SEC-002 |
| 验证码 | MD5 | SEC-003 |

---

## 扩展指南

### 扩展 1：新增规则

**步骤 1**：在 `qgy-back-rules/rules/` 创建 `xxx.yaml`

```yaml
# qgy-back-rules/rules/my-new-rule.yaml
name: 我的新规则
version: 1.0.0
updated: 2026-04-02

rules:
  - id: NEW-001
    level: MANDATORY
    category: new_category
    description: 新规则描述
```

**步骤 2**：在 `qgy-back-rules/data/scenario-rules.csv` 添加路由

```csv
关键词,场景,加载规则,加载Skill
新功能,新功能,my-new-rule,qgy-back-common
```

**完成！** 无需修改其他文件。

### 扩展 2：新增 Skill

**步骤 1**：创建目录结构

```
qgy-back-xxx/
├── SKILL.md              # Skill 描述
├── rules/                # 可选：专属规则
│   └── xxx.yaml
└── references/          # 可选：详细文档
    └── xxx.md
```

**步骤 2**：编写 SKILL.md

```markdown
---
name: qgy-back-xxx
description: xxx 规范。当用户提到 xxx 时激活此技能。
---

# xxx 规范

## 规则引用

从 qgy-back-rules/rules/xxx.yaml 加载规则。

## 使用场景

- xxx
- xxx
```

**步骤 3**：在 `qgy-back-full/SKILL.md` 路由表添加一行

```markdown
| 新功能 | xxx | my-new-rule | qgy-back-xxx |
```

### 扩展 3：修改现有规则

**只需修改一个文件**：

| 要修改的内容 | 修改文件 |
|-------------|---------|
| 分页限制 | rules/pagination.yaml |
| 命名规范 | rules/naming.yaml |
| MySQL 建表 | rules/mysql-table.yaml |
| ... | ... |

**无需同时修改**：SKILL.md、references/、其他 Skill

### 扩展 4：添加决策矩阵

**场景**：新增一个 `batch-sizes.csv` 批次大小配置

**步骤 1**：创建 `data/batch-sizes.csv`

```csv
场景,最小批次,最大批次,推荐批次
数据清洗,1,500,100
数据导入,1,1000,200
数据导出,1,500,50
```

**步骤 2**：在 `query-rules.js` 添加解析逻辑

---

## 规范索引

### 按领域分类

| 领域 | 规则文件 | 说明 |
|------|---------|------|
| 接口 | pagination.yaml | 分页、遍历限制 |
| 命名 | naming.yaml | DTO、表、字段命名 |
| 安全 | security.yaml | 哈希、权限、校验 |
| 通用 | general.yaml | 开发环境、批量操作、重构 |
| MySQL | mysql-*.yaml | 建表、索引、SQL、ORM |
| ES | elasticsearch.yaml | 字段映射、导出方案 |
| MQ | mq.yaml | 幂等性 |
| 数据 | input-cleaning.yaml, data-cleaning.yaml | 清洗规范 |

### 按规则ID索引

| 前缀 | 分类 | 示例 |
|------|------|------|
| PAGE-* | 分页 | PAGE-001, PAGE-002 |
| NAME-* | 命名 | NAME-001, NAME-002 |
| SEC-* | 安全 | SEC-001, SEC-002 |
| TBL-* | 建表 | TBL-001, TBL-002 |
| IDX-* | 索引 | IDX-001, IDX-002 |
| SQL-* | SQL | SQL-001, SQL-002 |
| ES-* | ES | ES-001, ES-002 |
| MQ-* | MQ | MQ-001, MQ-002 |
| CLEAN-* | 清洗 | CLEAN-001, CLEAN-002 |
| GEN-* | 通用 | GEN-001, GEN-002 |

---

## 更新日志

### v1.0.0 (2026-04-02)
- 初始版本
- 12 个 YAML 规则文件
- 3 个 CSV 决策矩阵
- 动态路由模式
