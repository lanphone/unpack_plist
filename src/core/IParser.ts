export interface IParser {
    parse(configFilePath: string, callback: (err:Error, trimData: ITrimData) => void),
}

export interface ITrimItemData {
    name: string,
    rotated: boolean,
    degree: number,
    frame: number[],
    sourceColorRect: number[],
    sourceSize: number[]
}

export interface ITrimData {
    atlasPath: string,
    itemDatas: ITrimItemData[]
}