export interface IParser {
    parse(plistFile: string, callback: (err:Error, packData: IPackData) => void),
}

export interface ITrimData {
    name: string,
    rotated: boolean,
    degree: number,
    frame: number[],
    sourceColorRect: number[],
    sourceSize: number[]
}

export interface IPackData {
    atlasPath: string,
    trimDatas: ITrimData[]
}