# 通用规范

## 开发环境规范

【强制】开发环境和测试环境必须打印最终执行SQL。

【强制】如果开发环境和测试环境数据不足以支撑验证和测试，则跟运维沟通把生产环境部分数据同步到开发环境和测试环境来验证和测试。

## 分片表规范

【强制】对分片表执行DQL及DML时，必须带上分片键。

## 批量操作规范

【强制】批量更新场景用update case when，批量插入或混合场景用insert on duplicate key update。

### update case when 示例
```sql
UPDATE table_name
SET status = CASE id
    WHEN 1 THEN 'active'
    WHEN 2 THEN 'inactive'
    WHEN 3 THEN 'pending'
END
WHERE id IN (1, 2, 3)
```

### insert on duplicate key update 示例
```sql
INSERT INTO table_name (id, name, status)
VALUES (1, 'A', 'active'), (2, 'B', 'inactive')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
status = VALUES(status)
```
