# Doge前端
<img decoding="async" src="https://user-images.githubusercontent.com/32875468/219337692-1a277d2a-fa56-4d09-862a-a73335462889.png" width="30%">

#### 介绍
后台管理系统无论在什么业务中都很重要，但是市面上各式各样的系统个人都不怎么满意，因此打算自己从头做一个。  
这个项目是从21年开始的，那时候大概连续做了一两个月左右，做了半截后扔那晾了两年；最近离职了，在家闲下来的时间把这个项目大体上又做了下完善，算是告一段落。  
这是一个类似脚手架的系统，我参考了一些后台管理系统，总结出了一些通用的模块给做到了里面，我的想法是以后如果有新的项目，基本上可以直接在这个半成品系统的基础上搭建。  
我给它起名叫Doge。至于为什么？因为暂时没想到什么好名字，Doge，要的就是这种玩世不恭的态度。

这是Doge前端，配合[Doge后端](https://github.com/a1782680475/doge-backend)使用。这个项目开始做的时候Antd Pro V5版本还在预览阶段，当时毫不犹豫就使用了，期间也随着正式版发布进行过几次对应升级。但是两年过去了，Antd Pro V6已经进入开发，而其依赖的Antd V5 API相比V4变动较大，升级并不平滑，改动比较大，UI个人感觉还没有V4好看。我会随时观察，等时机合适会将该项目进行升级重写。

#### 功能
1、个人中心  
2、用户管理  
3、角色管理  
4、菜单管理  
5、系统监控  
6、系统日志  
7、消息系统  
总而言之就是实现了一套基本通用的用户、权限、日志、监控业务。  
时间原因还有功能未开发，会慢慢补全：  
~~1、安全中心；~~  
2、用户注册（这个得评估一下，基本上后台管理系统注册功能是不需要的）；  
3、消息系统添加WebSocket实现；  
4、私信、公告管理模块（私信这块也需要评估，因为不同系统所需要的模式不一样，比如是否是通讯录、好友这种模式，还是钉钉那种带组织架构的）；  
5、工作流；  
6、JWT自动续期；


#### 截图
![image](https://user-images.githubusercontent.com/32875468/219319330-e34572d8-1898-4a8f-ae6a-80785129cf17.png)
![image](https://user-images.githubusercontent.com/32875468/219321578-0a8b4eee-ccaf-49d5-b6e5-ab72d4afb9fa.png)
![image](https://user-images.githubusercontent.com/32875468/219321663-d3f94844-fba4-4456-9aae-015c9a320a12.png)
![image](https://user-images.githubusercontent.com/32875468/219321711-d901f6d4-e167-4d45-b706-1cb651fa0daa.png)
![image](https://user-images.githubusercontent.com/32875468/219321776-780a3397-6bf4-44fc-9281-171e18d32710.png)
![image](https://user-images.githubusercontent.com/32875468/219342831-1ddbce1b-f11e-44b8-97cc-aececa8c32a8.png)
![image](https://user-images.githubusercontent.com/32875468/219321840-01edc430-e8e2-4956-97cd-56c67bb629a0.png)
![image](https://user-images.githubusercontent.com/32875468/219321921-b8f7cd8d-8f99-418b-a2f6-586d5c7a321d.png)
![image](https://user-images.githubusercontent.com/32875468/219321972-fc82ab5d-6a48-4467-bb42-b5cb290e6914.png)
![image](https://user-images.githubusercontent.com/32875468/219322289-a5457e32-98bb-43e0-9287-2d2789298aa1.png)
![image](https://user-images.githubusercontent.com/32875468/219322520-35f09424-0ec7-490a-8e7f-42acecfb7c30.png)
![image](https://user-images.githubusercontent.com/32875468/219322613-6e9e8c11-3c87-422b-be88-5c04fc1591a1.png)
![image](https://user-images.githubusercontent.com/32875468/219322682-ed16950b-60d2-4bb0-b408-792dc50ddc05.png)


#### 软件架构
Antd Pro V5  
Umi V3  
React V18
