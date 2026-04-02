# ORM 映射规范（以 MyBatis 为例）

1. **【强制】** 表查询禁止使用 `*`，必须明确列出所需字段。
2. **【强制】** POJO 类的布尔属性不能加 `is` 前缀（如 `isSuccess` 应改为 `success`），但数据库字段必须为 `is_xxx`，并在 `resultMap` 中映射。
3. **【强制】** 不要用 `resultClass` 作为返回参数，即使属性与字段一一对应，也必须定义 `resultMap`。每个表对应一个 DO 类。
4. **【强制】** XML 配置中参数使用 `#{}`，禁止使用 `${}`（防 SQL 注入）。
5. **【强制】** 不推荐使用 iBATIS 的 `queryForList(String, int, int)`（会全量查询再 subList，有 OOM 风险）。改用分页参数 `#start#`、`#size#`。
6. **【强制】** 禁止直接使用 `HashMap` / `Hashtable` 作为查询结果集输出。
7. **【强制】** 更新记录时必须同时更新 `update_time`（或 `gmt_modified`）为当前时间。
8. **【推荐】** 不要写全字段更新接口，只更新实际变化的字段。
9. **【参考】** 事务 `@Transactional` 不要滥用，需考虑回滚方案（缓存、搜索引擎、消息补偿等）。
10. **【参考】** 动态 SQL 标签：
    - `<isEqual>`：`compareValue` 为常量，通常比较数字
    - `<isNotEmpty>`：不为空且不为 null
    - `<isNotNull>`：不为 null
