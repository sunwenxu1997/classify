# Classify
这是一个开源的无需服务器，用于分类物品的项目。你可以用它来管理你的衣服（衣柜），商品（橱窗），饭菜（菜单）等，凡是一切可以分类得，你都可以拿来使用。

>注意：目前项目是寄托在 github page 上，打开速度可能有待提高。
>上传图片时建议尽量保持比例 `1:1` 的正方形图片；
>图片不要太大，可在 [https://tinypng.com/](https://tinypng.com/) 压缩下，否则加载会很吃力

<center><img src="https://sunwenxu1997.github.io/classfiy/images/classfiy_1.gif"  width="800"></center>

## 功能
1. 分类展示，可通过维护 `public/分类` 文件，用户自定义自己的左侧分类栏目。
* `1-帽子`：其中`1-`部分为排序，不会在分类栏目中展示，可以设置你想要靠前得分类；
* `1-鸭舌帽(白).jpg`：内部图片同理,`1-`可以选择作为排序，也可以作为编号，会展示在内容的左上角；
* 假如你不想展示具体名称，你可以直接定义`3-.jpg`即可不展示，但是其中得编号是必要得；（文件名总要有个东西在吧🙄）

<center><img src="https://sunwenxu1997.github.io/classfiy/images/classfiy_2.png"  width="800"></center>

2. 用户的喜欢收藏
* 通过在用户本地（localStorage）来存储用户喜欢的选项；
* 可移除喜欢操作

## 文件目录

```
├─public          
│  └─分类              // 主要编辑部分
│      ├─1-帽子
│      ├─2-上衣
│      ├─3-裤子
│      ├─4-鞋类
│      └─5-饰品
└─src
    ├─assets
    ├─components
    ├─router
    ├─stores
    └─views
```

## 可拓展
后期可能会考虑增加金额和优化喜欢栏目吧。但后续优化都应该不会打破用户主导的本地操作的初衷，无需搭建服务器，通过文件夹维护的理念。

maybe文件名会变成这样？`1-鸭舌帽(白)￥15.00元.jpg`

## 项目启动

```sh
npm install
```

### 运行

```sh
npm run dev
```

### 部署

```sh
npm run build
```
