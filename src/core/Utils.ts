export class Utils {
    static strArr2NumArr(arr) {
        for (let i = 0; i < arr.length; i++)
            arr[i] = Number(arr[i]);
    }
}