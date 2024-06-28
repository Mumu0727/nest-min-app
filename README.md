### nest增删改查demo-002

对两张存在一对多/多对一关系的表进行增删改查
有一个user表和一个photo表，一个user可以有多个photo，但一个photo只能属于一个user

相比001需注意的地方：
- 在新增photo时，根据传过来的userId去指定photo属于哪个user，保存之后，对应user的photo列表会自动更新
- 在删除/修改photo时，对应user的photo列表会自动更新
- 关联了任意个photo的user删除会报错，因为photo表的userId是外键

#### 本项目还整合了一个vue3项目打包后的文件，展示了用户名称列表
