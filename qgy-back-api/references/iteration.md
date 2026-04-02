# 遍历限制规范

## 存储中间件范围

本规范涉及的存储中间件包括：
- MySQL
- ElasticSearch
- MongoDB
- Redis

## 前端接口遍历限制

【强制】禁止在前端接口中循环调用存储中间件【MySQL，ElasticSearch，MongoDB及Redis等】接口，如不可避免需要向技术主管申请

### 问题说明
循环调用存储中间件会导致：
1. 存储中间件负载急剧上升
2. QPS双高（应用服务器和存储中间件同时高负载）
3. 接口响应时间不可控
4. 容易引发系统性风险

### 解决方案
- 使用批量查询替代循环单条查询
- 使用JOIN在数据库层面完成关联查询
- 使用缓存减少存储中间件访问次数

## 导出数据迁移遍历限制

【强制】在导出及数据迁移等功能中循环调用存储中间件【MySQL，ElasticSearch，MongoDB及Redis等】接口，必须睡眠100ms到200ms，如觉得不必要，需要向技术主管申请

### 睡眠要求
```java
for (Item item : items) {
    // 处理逻辑
    try {
        Thread.sleep(100); // 100-200ms
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}
```

### 申请条件
如果觉得睡眠不必要，需要向技术主管申请，说明理由并获得批准。
