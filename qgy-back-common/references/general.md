# 通用规范

## 开发环境规范

【强制】开发环境dev和测试环境test必须打印最终执行SQL,在-dev或者-test配置文件中增加mybatis sql打印配置。

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
