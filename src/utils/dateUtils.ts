/**
 * week (latestWeek) 是最近一周，从今天开始算，往前推七天
 * lastWeek (wholeWeek) 是上一周，上周一到上周日
 */
import { dateUtils } from 'druikit'
import { subDays, subMonths, getDate, getMonth, getYear, getDaysInMonth, startOfQuarter, endOfQuarter } from 'date-fns'

interface Day {
    day: number;
    // 七月 -> 7, 八月 -> 8
    month: number;
    year: number;
}

/**
 * 将日期类型的值转换为对象
 * 
 * parse  将字符串解析为对象
 * stringify   将对象变成字符串
 */
export function parseDateToDay(date: Date): Day {
    return {
        day: getDate(date),
        month: getMonth(date) + 1,
        year: getYear(date),
    }
}

export function formatDateInHeader(date: string) {
    return date.split('_').map(d => {
        const { year, month, day } = dateUtils.format(new Date(d))
        return `${day} ${dateUtils.MONTHS[Number(month) - 1]}. ${year.slice(2)}`
    }).join(' - ')
}

export function formatDateForApi(date: string) {
    const [ start, end ] = date.split('_')
    return { start, end }
}

/**
 * 获取完整整
 */
export const getLastWeeks = (weeks = 1, date = new Date()) => {
    const { startDate, endDate } = getWeekPeriod(date, weeks)
    return `${dateUtils.format(startDate).ymd}_${dateUtils.format(endDate).ymd}`
}

export function getLastWeeksOfLastYear(date = new Date()) {
    const newDate = subDays(date, 365)
    return getLastWeeks(0, newDate)
}

/**
 * 获取上一个完整月的日期值 
 */
export const getLastMonths = (months = 1, date = new Date()) => {
    const { startDate, endDate } = getMonthPeriod(date, months)
    return `${dateUtils.format(startDate).ymd}_${dateUtils.format(endDate).ymd}`
}

export function getLastMonthsOfLastYear(date = new Date) {
    const newDate = subDays(date, 365)
    return getLastMonths(0, newDate)
}

/**
 * 获取上一季度的日期值
 */
export const getLastQuarters = (quarters = 1, date = new Date()) => {
    const { startDate, endDate } = getQuarterPeriod(date, quarters)
    return `${dateUtils.format(startDate).ymd}_${dateUtils.format(endDate).ymd}`
}

export function getLastQuartersOfLastYear(date = new Date()) {
    const newDate = subDays(date, 365)
    return getLastQuarters(0, newDate)
}

function getWeekPeriod(date = new Date(), weeks = 0) {
    let dayOfWeek = date.getDay()     // 星期几
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek
    const startDate = subDays(date, (weeks - 1) * 7 + 6 + dayOfWeek)
    const endDate = subDays(date, (weeks - 1) * 7 + dayOfWeek)
    return { startDate, endDate }
}

function getMonthPeriod(date = new Date(), months = 0) {
    const year = date.getFullYear()
    const month = date.getMonth() - months
    const startDate = new Date(year, month, 1)
    const days = getDaysInMonth(startDate)
    const endDate = new Date(year, month, days)
    return { startDate, endDate }
}

function getQuarterPeriod(date = new Date(), quarters = 0) {
    const newDate = subMonths(date, 3 * quarters)
    const startDate = startOfQuarter(newDate)
    const endDate = endOfQuarter(newDate)
    return { startDate, endDate }
}

/* ******************************************************************** */
/**
 * 返回日期属于第几季度
 */
export function getQuarter(date: Date): number {
    const month = date.getMonth()
    return [ [], [ 0,1,2 ], [ 3,4,5 ], [ 6,7,8 ], [ 9,10,11 ] ].findIndex(item => item.includes(month))
}
