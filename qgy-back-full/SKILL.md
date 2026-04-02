---
name: qgy-back-full
description: 后端开发完整规范包（动态路由模式）。提供场景路由功能，根据任务关键词自动加载对应的规则和子技能。涵盖所有后端开发规范：分页、命名、安全、MySQL、ES、MQ、数据清洗等。
argument-hint: "[场景关键词]"
---

# qgy-back-full 后端开发完整规范（动态路由版）

本技能是后端开发规范的**路由中心**，根据任务关键词自动匹配对应的规则和子技能。

## 场景路由表

| 关键词 | 场景 | 加载规则 | 加载Skill |
|--------|------|----------|-----------|
| 接口设计 | API设计 | pagination, naming | qgy-back-api |
| 分页查询 | 分页 | pagination | qgy-back-api |
| 深分页 | 分页 | pagination | qgy-back-api |
| 接口变更 | 通用 | general | qgy-back-api |
| DTO设计 | 命名 | naming | qgy-back-common |
| 表设计 | MySQL | mysql-table | qgy-back-mysql |
| 索引设计 | MySQL | mysql-index | qgy-back-mysql |
| SQL编写 | SQL | mysql-sql | qgy-back-mysql |
| MyBatis | ORM | orm-mapping | qgy-back-mysql |
| ES查询 | ES | elasticsearch | qgy-back-storage |
| ES导出 | ES | pagination, elasticsearch | qgy-back-storage |
| MQ消费 | MQ | mq | qgy-back-storage |
| 输入清洗 | 数据处理 | input-cleaning | qgy-back-data |
| 数据清洗 | 数据处理 | data-cleaning | qgy-back-data |
| 数据导入 | 导入导出 | import-export | qgy-back-data |
| 数据导出 | 导入导出 | pagination, import-export | qgy-back-export |
| 日志规范 | 日志 | - | qgy-back-export |
| 安全审计 | 安全 | security | qgy-back-common |
| 变量重构 | 重构 | general, naming | qgy-back-common |
| 批量操作 | 通用 | general | qgy-back-common |
| 开发环境 | 通用 | general | qgy-back-common |
| **后端开发** | **完整规范** | **所有规则** | **qgy-back-rules** |

## 动态加载规则

根据 `$ARGUMENTS` 关键词自动加载对应规则：

```
用户: "帮我设计一个订单表"
    ↓ 检测到: 表设计, MySQL
    ↓ 加载: mysql-table 规则
    ↓ 输出: 建表规范 + 字段设计建议
```

### 加载逻辑

1. **解析关键词** - 从用户输入提取关键场景
2. **查询路由表** - 匹配对应的规则文件
3. **加载规则** - 从 `qgy-back-rules/rules/` 读取 YAML
4. **输出规范** - 按规则级别（MANDATORY/RECOMMENDED）展示

## 核心规范速查

### 🔴 MANDATORY（必须遵守）

| 分类 | 规则 | 说明 |
|------|------|------|
| 分页 | 前端接口页大小最大100，推荐10 | 超出需申请 |
| 分页 | 普通深分页最大100 | 超出需申请 |
| 分页 | 导出深分页最大500 | 超出需申请 |
| 命名 | 接口请求Dto后缀：ReqDto | - |
| 命名 | 接口响应Dto后缀：ResDto | - |
| 命名 | Dao层返回对象后缀：Do | - |
| 安全 | token哈希：HMAC512 | - |
| 安全 | 密码哈希：sha256 | - |
| MySQL | 表必备三字段：id, create_time, update_time | - |
| MySQL | 唯一索引：uk_字段名 | - |
| MySQL | 禁止外键与级联 | - |
| ES | MQ消费必须实现幂等 | - |
| 数据 | Mapper文件SQL必须与业务隔离 | - |

### 🟡 RECOMMENDED（强烈建议）

| 分类 | 规则 | 说明 |
|------|------|------|
| 分页 | 深分页使用游标分页 | 避免OFFSET性能问题 |
| 命名 | Service层禁止返回Result | 直接返回Dto对象 |
| MySQL | 金额用bigint存储分 | 避免浮点精度问题 |
| MySQL | 使用覆盖索引 | 避免回表 |
| ES | 高频导出用SearchAfter+PIT | - |
| ES | 一般导出用Scroll | - |

## 规则中心

**所有规则的单一真相来源：** `qgy-back-rules`

```
qgy-back-rules/
├── rules/                    # 12个YAML规则文件
│   ├── pagination.yaml       # 分页规则
│   ├── naming.yaml          # 命名规则
│   ├── security.yaml        # 安全规则
│   ├── general.yaml        # 通用规则
│   ├── mysql-table.yaml     # MySQL建表
│   ├── mysql-index.yaml     # MySQL索引
│   ├── mysql-sql.yaml       # SQL编写
│   ├── orm-mapping.yaml     # ORM映射
│   ├── elasticsearch.yaml    # ES规范
│   ├── mq.yaml             # MQ规范
│   ├── input-cleaning.yaml   # 输入清洗
│   └── data-cleaning.yaml    # 数据清洗
├── data/                    # 决策矩阵
│   ├── pagination-matrix.csv
│   ├── field-type-mapping.csv
│   └── scenario-rules.csv
└── scripts/
    └── query-rules.js       # 路由查询脚本
```

## 扩展规范

**新增规范步骤（只需2步）：**
1. 在 `qgy-back-rules/rules/` 添加 `xxx.yaml`
2. 在 `qgy-back-rules/data/scenario-rules.csv` 添加一行路由

**无需修改本文件！**

## 使用示例

```
/qgy-back-full "设计一个商品表"
/qgy-back-full "分页查询优化"
/qgy-back-full "数据清洗 Mapper隔离"
```

## 子技能引用

| Skill | 职责 | 使用场景 |
|-------|------|---------|
| qgy-back-rules | 规则中心 | 获取所有规则定义 |
| qgy-back-api | 接口规范 | 接口设计、分页、遍历 |
| qgy-back-common | 通用规范 | 命名、安全、批量操作 |
| qgy-back-data | 数据处理 | 清洗、导入导出 |
| qgy-back-export | 导出日志 | 数据导出、日志 |
| qgy-back-mysql | MySQL设计 | 建表、索引、SQL |
| qgy-back-storage | 存储层 | MySQL、ES、MQ |
