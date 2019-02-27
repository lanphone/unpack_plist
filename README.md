# unpack_tp

## unpack_texturepacker

把texturepacker 生成的图集，重新提取还原成多张小图

## 用法命令：

un 目录或数据文件 文件生成类型（比如cocos就是cc）

un dir(file) type

## 方法：

```javascript
/**
 * 解包图集，裁剪还原小图片
 * @param fileOrDir 配置文件绝对路径或文件目录（允许目录嵌套），支持批量处理
 * @param packType 文件类型，非文件后缀，仅提供了cocos支持，类型为 "cc"，可通过实现 IParser 接口扩展更多类型
 */
 function unpack(fileOrDir: string, packType: string)

/**
 * 注册自定义解析器
 * @param type string类型
 * @param parserCls 实现了IParser接口的类
 * @param ext 文件扩展名 (".plist")
 */
function registerParser(type: string, parserCls: any, ext:string)
```

## 编程式调用：

```javascript
var unpacker = require("Unpacker");

var path = require('path');

unpacker.unpack(path.resolve("test", "ui"), "cc");
```

## 扩展接口实现

目前仅支持cocos 的plist导出，实现IParser接口可增加支持更多类型

```javascript
var unpacker = require("Unpacker");
unpacker.registerParser(IParserCls, "unity");
unpacker.unpack(path.resolve("test", "ui"), "unity");
```

```javascript
/**
 * 解析器接口，实现parse方法
 */
export interface IParser {
    /**
     * 解析可能有异步操作，所以要返回 Promise<ITrimData>
     * @param configFilePath 
     */
    parse(configFilePath: string): Promise<ITrimData>
}

/**
 * 裁剪单张图片的所需要数据
 */
export interface ITrimItemData {
    /**
     * 图片名称
     */
    name: string,

    /**
     * 裁剪的时候是否需要旋转
     */
    rotated: boolean,

    /**
     * 旋转的角度
     */
    degree: number,

    /**
     * 真实的裁剪位置与大小，如果是旋转过的，要交换 w,h 的位置
     * [x, y, w, h]
     */
    frame: number[],

    /**
     * 原图像有效像素的矩形
     * [x, y, w, h]
     */
    sourceColorRect: number[],

    /**
     * 原图像的大小
     * [w, h]
     */
    sourceSize: number[]
}

/**
 * 图集的裁剪数据
 */
export interface ITrimData {

    /**
     * 图集的绝对路径
     */
    atlasPath: string,

    /**
     * 裁剪数据数组
     */
    itemDatas: ITrimItemData[]
}
```

注：需要使用build下的binding.node才能正确裁剪图片，images附带的有问题，第一次运行会自动复制到node_modules/images目录下，无需另外手动操作，

如果运行时有问题，请把nodejs升级到最新版本，作者开发时用的是11.10.0
