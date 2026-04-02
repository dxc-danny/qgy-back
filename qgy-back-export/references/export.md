# 导出规范

## 导出方案选择

【推荐】数据导出尽量用异步导出方案，需要实时导出才用同步方案。

### 异步导出优点
1. 用户体验更好，不需要长时间等待
2. 可以处理更大数据量
3. 减少服务器压力

### 同步导出场景
适用于小数据量、实时性要求高的场景。

## MySQL导出深分页

【强制】针对MySQL表的数据导出，如果导出数据量大于1万，则必须处理深分页问题。

### 深分页解决方案

1. **游标分页**：使用id或时间戳作为游标
```sql
SELECT * FROM table_name
WHERE id > #{lastId}
ORDER BY id ASC
LIMIT 100
```

2. **子查询优化**：
```sql
SELECT t.* FROM table_name t
INNER JOIN (
    SELECT id FROM table_name
    ORDER BY id
    LIMIT #{offset}, #{pageSize}
) AS temp ON t.id = temp.id
```

### 排序字段重复问题

【强制】注意排序字段重复问题，如create_time可能会重复，需要使用唯一字段，如id等。

**解决方案**：
- 使用唯一字段（如id）作为排序字段
- 或使用复合排序（create_time + id）

## ElasticSearch导出

### 导出方案选择

【推荐】对于高频场景导出（如用户场景）使用SearchAfter+PIT，对于一般场景导出（如后台场景）使用Scroll。

### SearchAfter + PIT

适用于高频场景，基于唯一字段进行深度分页。

```json
{
  "query": { "match_all": {} },
  "sort": [
    { "create_time": "asc" },
    { "id": "asc" }
  ],
  "size": 1000,
  "pit": {
    "id": "<pit_id>",
    "keep_alive": "5m"
  }
}
```

### Scroll

适用于一般场景，大规模数据导出。

```json
{
  "query": { "match_all": {} },
  "scroll": "5m",
  "size": 1000
}
```

【强制】针对ElasticSearch索引的数据导出，如果导出数据量大于1万，则必须通过Scroll或SearchAfter+PIT来处理深分页问题。

## 深分页配置表

| 数据源 | 数据量 | 推荐方案 | 排序字段要求 |
|-------|-------|---------|-------------|
| MySQL | >1万 | 游标分页 | 使用唯一字段如id |
| ES高频 | >1万 | SearchAfter+PIT | 复合排序 |
| ES一般 | >1万 | Scroll | 复合排序 |
