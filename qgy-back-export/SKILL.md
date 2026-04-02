---
name: qgy-back-export
description: 后端导出与日志规范。提供数据导出、深分页处理、日志规范。必须使用此技能当用户提到：数据导出、深分页、异步导出、日志、错误栈、log等场景。即使用户没有明确要求，涉及数据导出和日志记录时也要主动加载此规范。
---

# qgy-back-export 导出与日志规范

本技能涵盖数据导出规范、日志规范等内容。

## 导出方案选择

【推荐】数据导出尽量用异步导出方案，需要实时导出才用同步方案。

## MySQL导出深分页

【强制】针对MySQL表的数据导出，如果导出数据量大于1万，则必须处理深分页问题，同时要注意排序字段重复问题，如create_time可能会重复，需要使用唯一字段，如id等。

## ElasticSearch导出

### 导出方案选择
【推荐】对于高频场景导出（如用户场景）使用SearchAfter+PIT，对于一般场景导出（如后台场景）使用Scroll。

【强制】针对ElasticSearch索引的数据导出，如果导出数据量大于1万，则必须通过Scroll或SearchAfter+PIT来查询数据并处理深分页问题。

【强制】同时要注意排序字段重复问题，如create_time可能会重复，需要使用唯一字段，如id等。

## 排序字段重复问题

### 问题说明
如果使用create_time作为排序字段，多条数据的create_time可能相同，导致分页时数据重复或遗漏。

### 解决方案
1. 使用唯一字段（如id）作为排序字段
2. 或使用复合排序（create_time + id）

## 日志规范

【推荐】打印错误日志时，将错误栈（Throwable）也打印出来。

### 正确示例
```java
try {
    // 业务逻辑
} catch (Exception e) {
    log.error("操作失败", e); // 打印完整错误栈
}
```

### 错误示例
```java
try {
    // 业务逻辑
} catch (Exception e) {
    log.error("操作失败: " + e.getMessage()); // 只打印消息，不打印错误栈
}
```

## 相关规范

详细规范内容请参阅 references 目录：
- [export.md](references/export.md) - 导出规范
- [logging.md](references/logging.md) - 日志规范
