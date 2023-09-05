import { cloneDeep } from 'lodash'

/**
 * a1 是否是 a2 的父集
 * 
 * a1 = ['a', 'b', 'c']
 * a2 = ['a', 'b']
 * a3 = ['a', 'd']
 * isSuperArray(a1, a2)   // => true
 * isSuperArray(a1, a3)   // => false
 */
export function isSuperArray(a1: string[], a2: string[]) {
    return a1.filter(item => a2.includes(item)).length === a2.length
}

export function isEqual(a1: string[], a2: string[]) {
    return cloneDeep(a1).sort().toString() === cloneDeep(a2).sort().toString()
}

export function isRepeat(a1: any[]) {
    return Array.from(new Set(a1)).length < a1.length
}
