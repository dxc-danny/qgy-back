# 消息队列规范

## 消息消费幂等

【强制】消息消费必须实现幂等逻辑，如果重复消费没有副作用则可不实现幂等逻辑。

## 幂等实现方案

### 方案一：唯一键去重
在消费逻辑中，先检查是否已经处理过（通过唯一键查询），如果已处理则直接返回成功。

```java
@RabbitListener(queues = "xxx")
public void consume(Message msg) {
    String uniqueKey = msg.getId();
    // 检查是否已处理
    if (idempotentService.isProcessed(uniqueKey)) {
        return; // 已处理，直接返回
    }
    // 处理业务逻辑
    doBusiness(msg);
    // 标记为已处理
    idempotentService.markProcessed(uniqueKey);
}
```

### 方案二：数据库唯一索引
利用数据库唯一索引防止重复插入。

### 方案三：分布式锁
使用分布式锁（如Redis）保证同一消息只被处理一次。

## 消息队列选择

常用的消息队列：
- RocketMQ
- Kafka
- RabbitMQ

## 注意事项

1. 消息消费必须考虑失败重试机制
2. 需要设置合理的重试次数和间隔
3. 死信队列需要定期处理
4. 消费端需要做好异常捕获，避免消息丢失
