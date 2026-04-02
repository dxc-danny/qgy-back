# ElasticSearch规范

## 字段类型映射

### 日期时间字段
【推荐】对于日期时间类型字段：
- Java侧字段类型：`ZonedDateTime`
- format：`DateFormat.date_time`
- pattern：不设置
- ElasticSearch侧字段类型：`date`
- ES格式：`strict_date_time`
- 搜索时直接传入ZonedDateTime对象，不需要转换为当前时区时间字符串

**注意**：对于历史Java侧使用了Date和自定义格式的，在搜索时需要带上时区。

### 纯日期字段
【推荐】对于纯日期类型字段：
- Java侧字段类型：`String`
- format：`{}`
- pattern：`uuuu-MM-ddXXX`
- ElasticSearch侧字段类型：`date`
- ES格式：`yyyy-MM-ddXXX`
- 搜索时需要把ZonedDateTime对象转换为带当前时区的时间字符串

## 导出方案

### 高频场景
【推荐】对于高频场景导出（如用户场景），使用 `SearchAfter + PIT`

### 一般场景
【推荐】对于一般场景导出（如后台场景），使用 `Scroll`

## 深分页处理

【强制】针对ElasticSearch索引的数据导出，如果导出数据量大于1万，则必须通过Scroll或SearchAfter+PIT来查询数据并处理深分页问题。

【强制】同时要注意排序字段重复问题，如create_time可能会重复，需要使用唯一字段，如id等。

### 排序字段重复问题解决方案

1. 使用唯一字段（如id）作为排序字段
2. 或者使用复合排序（create_time + id）

### SearchAfter + PIT 示例

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

### Scroll 示例

```json
{
  "query": { "match_all": {} },
  "scroll": "5m",
  "size": 1000
}
```
