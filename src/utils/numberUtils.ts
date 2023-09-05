
/**
 * 数值每三位用逗号隔开
 */
export function formatNumberByComma(value: any): string {
    if (typeof value !== 'string' && typeof value !== 'number') {
        return ''
    } else if (!isNumberOfStringType(String(value))) {
        return String(value)
    } else if (isInt(Number(value))) {
        // 整数
        return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
        // 小数
        // numArr[0] 整数   numArr[1] 小数
        const numArr = String(value).split('.')
        numArr[0] = String(numArr[0]).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return numArr.join('.')
    }
}

/**
 * 是否是字符串类型的数值
 */
export function isNumberOfStringType(value: any): boolean {
    return String(Number(value)) !== 'NaN' && value !== null;
}

/**
 * 是否是整数
 */
export function isInt(value: any): boolean {
    return typeof value === 'number' && !String(value).includes('.')
}

/**
 * 加法
 */
export function plus(arg1: number, arg2: number): number {
    let r1; let r2
    try {
        r1 = String(arg1).split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = String(arg2).split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    // eslint-disable-next-line
    const m = 10 ** Math.max(r1, r2)
    return (arg1 * m + arg2 * m) / m
}

/**
* 减法
*/
export function minus(arg1: number, arg2: number): number {
    let r1; let r2
    try {
        r1 = String(arg1).split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = String(arg2).split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    const n = Math.max(r1, r2)
    // eslint-disable-next-line
    const m = 10 ** n
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
}

/**
* 乘法
*/
export function multiply(arg1: number, arg2: number): number {
    let m = 0
    const s1 = String(arg1)
    const s2 = String(arg2)
    try {
        m += s1.split('.')[1].length
        // eslint-disable-next-line
    } catch (e) { }
    try {
        m += s2.split('.')[1].length
        // eslint-disable-next-line
    } catch (e) { }
    // eslint-disable-next-line
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / (10 ** m)
}

/**
* 除法
*/
export function divide(arg1: number, arg2: number): number {
    let t1; let t2
    try {
        t1 = String(arg1).split('.')[1].length
    } catch (e) {
        t1 = 0
    }
    try {
        t2 = String(arg2).split('.')[1].length
    } catch (e) {
        t2 = 0
    }
    const r1 = Number(String(arg1).replace('.', ''))
    const r2 = Number(String(arg2).replace('.', ''))
    // eslint-disable-next-line
    return multiply((r1 / r2), 10 ** (t2 - t1))
}
