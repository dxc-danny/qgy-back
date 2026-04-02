# MySQL规范

## 字段类型映射

### 日期时间字段
【推荐】对于日期时间类型字段：
- Java侧字段类型：`LocalDateTime`
- MySQL侧字段类型：`datetime`

### 纯日期字段
【推荐】对于纯日期类型字段：
- Java侧字段类型：`LocalDate`
- MySQL侧字段类型：`date`

### 金额字段
【推荐】对于金额字段：
- Java侧字段类型：`BigDecimal`
- MySQL侧字段类型：`Decimal`
- 精度：`(16,2)`
- 特殊情况需要沟通确认

### 删除字段（软删除）
【推荐】对于删除字段：
- Java侧字段类型：`Long`
- MySQL侧字段类型：`Unsigned Bigint`
- 未删除值：`0`
- 删除值：当前毫秒时间戳
- 特殊情况需要沟通确认

## 查询规范

【强制】getByCode及listByCodes等类似这样的针对索引字段查询数据的场景，一定要判断参数是否为空再做业务逻辑处理，不要把空吃掉了，避免查询出不符合业务逻辑的数据。

### 错误示例
```xml
<select id="getByControlCode" resultMap="AllColumnMap">
    select
    <include refid="all_column"/>
    from device_cabinet_control
    <where>
        <if test="controlCode != null">
            AND `control_code` = #{controlCode}
        </if>
    </where>
</select>
```

### 正确示例
```xml
<select id="getByControlCode" resultMap="AllColumnMap">
    select
    <include refid="all_column"/>
    from device_cabinet_control
    WHERE `control_code` = #{controlCode}
</select>
```

## 批量操作

### 批量更新
【强制】批量更新场景用 `update case when`

```sql
UPDATE table_name
SET status = CASE id
    WHEN 1 THEN 'active'
    WHEN 2 THEN 'inactive'
END
WHERE id IN (1, 2)
```

### 批量插入或混合
【强制】批量插入或混合场景用 `insert on duplicate key update`

```sql
INSERT INTO table_name (id, name, status)
VALUES (1, 'A', 'active'), (2, 'B', 'inactive')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
status = VALUES(status)
```
