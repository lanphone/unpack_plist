# unpack_tp
unpack_texturepacker

把texturepacker 生成的图集，重新提取还原出来

用法命令：

un 目录或数据文件 文件生成类型（比如cocos就是cc）

un dir(file) type

编程式调用：

var unpacker = require("unpacker_tp");

var path = require('path');

unpacker.unpack(path.resolve("test", "ui"), "cc");


目前仅支持cocos 的plist导出，实现IParser接口可增加支持更多类型

注：需要使用build下的binding.node才能正确裁剪图片，images附带的有问题，第一次运行会自动复制到node_modules/images目录下,

如果运行时有问题，请把nodejs升级到最新版本，本项目开发时用的是11.10.0
