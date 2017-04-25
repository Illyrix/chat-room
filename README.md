## 实时聊天系统
api定义文档

### 用户系统
#### 创建用户
[POST] /User  

request ->  
```
{
    "username": "zhangjiagou",
    "password": "zjh1997@stupid",
    "nickname": "I'm angry"
}
```
response <-  
201 Created

#### 获取用户信息
[GET] /User/{:username}   
返回用户名为 {:username} 的用户信息  

request ->  
No Content

response ->  
```
{
    "username": "zhangjiagou",
    "nickname": "I'm angry"
}
```
#### 登录
[POST] /Login  
password 通过 MD5 进行加密  
返回 status 代表登陆成功与否  

request ->  
```
{
    "username": "zhangjiagou",
    "password": "4d510c418bc52a780b00ab153f1f488b6154d01f"
}
```

response ->  
```
{
    "status": true
}
```

#### 登出
[POST] /Logout  

request ->  
No Content  

response ->  
```
{
    "status": true
}
```

### 聊天系统
#### 获取所有有权限的聊天室
[GET] /Room   

request ->  
No Content  

response ->  
```
[
    {
        "id": 5,
        "name": "zhangjiagou1的聊天室的名字"
    },
    {
        "id": 3,
        "name": "zhangjiagou2的聊天室的名字"
    },
    {
        "id": 1,
        "name": "zhangjiagou3的聊天室的名字"
    },
]
```

#### 创建聊天室
[POST] /Room  
创建时会鉴权  

request ->  
```
{
    "name": "zhangjiagou的聊天室的名字"
}
```
response ->  
201 Created  

#### 删除聊天室
[DELETE] /Room/{:id}  
删除 id 为 {:id} 的聊天室  

request ->  
No Content  

response ->  
204 No Content  

#### 进入聊天室
Step1: 请求聊天室的 token  
[GET] /Room/{:id}  
进入 id 为 {:id} 的聊天室  
返回 token 用于建立和聊天服务的 websocket 连接  

request ->  
No Content  

response ->  
```
{
    "token": "8c510c418bc52a780b11ab153f1f488b6154df10"
}
```
Step2: 通过 token 连接 websocket 服务  
connect url: ws://xxxxxx.com:3000 (待定)  
onConnected: 发送刚拿到的 token  
```
{
    "token": "8c510c418bc52a780b11ab153f1f488b6154df10"
}
```
#### 发送消息
向 websocket 连接发送  
```
{
    "msg": "今天天气好好啊"
}
```
可能返回  
```
{
    "status": true
}
```
代表发送成功  
或者  
```
{
    "status": false
}
```
代表发送失败(比如被移出聊天室)  

#### 接收消息
分两种情况:  
* 别人的消息接收  
```
{
    "type": 0,
    "msg": "今天天气真好",
    "username": "zhangjiagou",
    "nickname": "zjg",
    "time": 1492785220
}
```
__time 代表时间戳__  
* 别人进入/离开  
```
{
    "type": 1,
    "username": "zhangjiagou",
    "nickname": "zjg",
    "action": 0,
    "time": 1492785220
}
```
0: 离开; 1: 进入  

#### 离开聊天室
close websocket connection  
