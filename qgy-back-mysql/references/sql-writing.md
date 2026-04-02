# SQL 编写规范

1. **【强制】** 不要用 `count(列名)` 或 `count(常量)` 替代 `count(*)`。`count(*)` 统计所有行（含 NULL）。
2. **【强制】** `count(distinct col)` 计算非 NULL 的不重复数量。`count(distinct col1, col2)` 中若任一列全为 NULL，结果为 0。
3. **【强制】** 某列全为 NULL 时，`count(col)` 返回 0，`sum(col)` 返回 NULL。避免 NPE：
   ```sql
   SELECT IF(ISNULL(SUM(g)), 0, SUM(g)) FROM table;
   ```
4. **【强制】** 使用 ISNULL() 判断 NULL。注意 NULL 与任何值比较结果均为 NULL（包括 NULL=NULL）。
5. **【强制】** 分页查询时，若 count 为 0 应直接返回，不执行后续分页语句。
6. **【强制】** 不得使用外键与级联，所有外键约束在应用层解决。
7. **【强制】** 禁止使用存储过程。
8. **【强制】** 数据订正（DELETE/UPDATE）前必须先 SELECT 确认。
9. **【推荐】** 避免使用 IN，如无法避免则集合元素数量控制在 1000 以内。
10. **【参考】** 全球化应用使用 utf8 编码，字符长度用 CHARACTER_LENGTH 而非 LENGTH。需要表情符号时使用 utf8mb4。
11. **【参考】** 禁止在代码中使用 TRUNCATE TABLE（无事务、不触发 trigger，风险高）。
12. **【参考】** 谨慎使用触发器，避免嵌套，关注性能影响。
13. **【推荐】** 插入时若唯一键重复则更新，使用 INSERT ... ON DUPLICATE KEY UPDATE。
14. **【推荐】** 大数据量模糊匹配时建立 FULLTEXT 索引，使用 MATCH() AGAINST() 检索。
