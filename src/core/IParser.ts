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
     * 有效像素的矩形
     * [x, y, w, h]
     */
    sourceColorRect: number[],

    /**
     * 原图片的大小
     * [w, h]
     */
    sourceSize: number[]
}
