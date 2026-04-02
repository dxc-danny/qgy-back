---
name: qgy-back-storage
description: 后端存储层规范。提供MySQL、ElasticSearch、消息队列等存储中间件的规范。必须使用此技能当用户提到：MySQL、ElasticSearch、MongoDB、Redis、ES查询、Scroll、SearchAfter、MQ消费、幂等、dao、mapper等场景。即使用户没有明确要求，涉及存储中间件操作时也要主动加载此规范。
---

# qgy-back-storage 存储层规范

本技能涵盖MySQL规范、ElasticSearch规范、消息队列规范等内容。

## MySQL规范

### 日期时间字段
【推荐】对于日期时间类型字段，Java侧字段类型为LocalDateTime，MySQL侧字段类型为datetime

### 纯日期字段
【推荐】对于纯日期类型字段，Java侧字段类型为LocalDate，MySQL侧字段类型为date

### 金额字段
【推荐】对于金额字段，Java侧字段类型为BigDecimal，MySQL侧字段类型为Decimal，精度为(16,2)，特殊情况沟通。

### 删除字段
【推荐】对于删除字段，Java侧字段类型为Long，MySQL侧字段类型为Unsigned Bigint，未删除值为0，删除为当前毫秒时间戳，特殊情况沟通。

### 查询规范
【强制】getByCode及listByCodes等类似这样的针对索引字段查询数据的场景，一定要判断参数是否为空再做业务逻辑处理，不要把空吃掉了，避免查询出不符合业务逻辑的数据。

## ElasticSearch规范

### 日期时间字段
【推荐】对于日期时间类型字段，Java侧字段类型为ZonedDateTime，format为DateFormat.date_time，不设置pattern，ElasticSearch侧字段类型为date，格式为strict_date_time，搜索时直接传入ZonedDateTime对象就行，不需要转换为当前时区时间字符串。对于历史Java侧使用了Date和自定义格式的，在搜索时需要带上时区。

### 纯日期字段
【推荐】对于纯日期类型字段，Java侧字段类型为String，format设置为{}，pattern为uuuu-MM-ddXXX，ElasticSearch侧字段类型为date，格式为yyyy-MM-ddXXX，搜索时需要把ZonedDateTime对象转换为带当前时区的时间字符串。

### 导出深分页
【强制】针对ElasticSearch索引的数据导出，如果导出数据量大于1万，则必须通过Scroll或SearchAfter+PIT来查询数据并处理深分页问题，同时要注意排序字段重复问题，如create_time可能会重复，需要使用唯一字段，如id等。

【推荐】对于高频场景导出用SearchAfter+PIT，如用户场景；如果是一般场景导出用Scroll，如后台场景。

## 消息队列规范

### 消息消费幂等
【强制】消息消费必须实现幂等逻辑，如果重复消费没有副作用则可不实现幂等逻辑。

## 相关规范

详细规范内容请参阅 references 目录：
- [mysql.md](references/mysql.md) - MySQL规范
- [elasticsearch.md](references/elasticsearch.md) - ElasticSearch规范
- [mq.md](references/mq.md) - 消息队列规范
