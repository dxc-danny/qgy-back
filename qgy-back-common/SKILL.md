---
name: qgy-back-common
description: 后端开发基础通用规范。提供开发环境、分片表、批量操作、变量重构等基础规范。必须使用此技能当用户提到：后端开发、Java开发、分片表操作、批量更新、变量重构、DTO变更、Map返回重构等场景。即使用户没有明确要求，也要主动加载此规范确保开发基础正确。
---

# qgy-back-common 基础通用规范

本技能提供后端开发的基础通用规范，适用于所有 Java 后端项目。

## 核心规则

### 开发环境
【强制】开发环境和测试环境必须打印最终执行SQL。

【强制】如果开发环境和测试环境数据不足以支撑验证和测试，则跟运维沟通把生产环境部分数据同步到开发环境和测试环境来验证和测试。

### 分片表规范
【强制】对分片表执行DQL及DML时，必须带上分片键。

### 批量操作
【强制】批量更新场景用update case when，批量插入或混合场景用insert on duplicate key update。

## 变量重构规范

【强制】修改变量类型或值空间，则需要找到所有使用该变量的代码，并做对应修正。

【强制】修改DTO，PO，BO，DO等对象【含MAP】的字段类型或值空间时，需要修改所有直接及间接使用到该对象字段的全链路代码，包括但不限于：
1. 生成该对象字段的下游代码
2. 基于该对象字段执行业务逻辑的代码
3. 基于该对象字段的上游代码
4. MySQL的CRUD代码
5. MongDB的CRUD代码
6. ElasticSearch的CRUD代码
7. Redis的CRUD代码
8. 消息发送及消费代码，如RocketMQ或Kafka
9. 数据同步代码，如MySQL同步到ElasticSearch，MongoDB同步到ElasticSearch，MySQL同步到MongoDB等
10. 使用该DTO字段的定时任务代码
11. 使用该DTO字段的其它项目代码

同时需要把该字段优化为枚举类型。

【强制】增加或删除DTO，PO，BO，DO等对象【含MAP】的字段时，需要修改所有直接及间接使用到该对象字段的全链路代码（范围同上）。

## Map返回重构

【强制】把Controller和Service等类的方法返回的Map按【命名规范】重构为对象。

## 分层职责

| 层级 | 方向 | 对象类型 | 命名后缀 |
|------|------|---------|---------|
| Controller | 入参 | Dto对象 | ReqDto |
| Controller | 出参 | Dto对象 | ResDto |
| Service | 出参 | Dto对象 | ResDto |
| Dao/Mapper | 出参 | Do对象 | Do |

## 相关规范

详细规范内容请参阅 references 目录：
- [naming.md](references/naming.md) - 命名规范
- [security.md](references/security.md) - 安全基础
- [general.md](references/general.md) - 通用规范
