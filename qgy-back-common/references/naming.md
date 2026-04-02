# 命名规范

## Dto命名

【强制】接口方法请求的Dto对象，类名后缀为ReqDto，例子：OperatorUpdateCurrentReqDto

【强制】接口方法返回的Dto对象，类名后缀为ResDto，例子：OperatorLoginResDto

【强制】Dao层的方法直接返回Do对象，类名后缀为Do

## 注解使用

【推荐】接口方法请求注解使用GetMapping，PostMapping，PutMapping，DeleteMapping等，不建议使用RequestMapping

## Service层

【强制】Service层的方法禁止返回Result，直接返回Dto对象，类名后缀为ResDto

## 命名对照表

| 层级 | 对象类型 | 命名后缀 | 示例 |
|------|---------|---------|------|
| Controller入参 | Request Dto | ReqDto | OperatorUpdateCurrentReqDto |
| Controller出参 | Response Dto | ResDto | OperatorLoginResDto |
| Service层 | Dto | ResDto | - |
| Dao/Mapper | Data Object | Do | UserDo |
