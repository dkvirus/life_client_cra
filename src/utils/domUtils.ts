/**
 * Manipulate DOM-related methods
 */

export function getClassName(element): string {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ')
}

export function hasClassName(element, name) {
    const list = typeof element == 'string' ? element : getClassName(element)
    return list.indexOf(' ' + name + ' ') >= 0
}

export function addClassName(element, name) {
    const oldList = getClassName(element)
    const newList = oldList + name
    if (hasClassName(oldList, name)) return
    element.className = newList.substring(1)
}

export function delClassName(element, name) {
    const oldList = getClassName(element)
    const newList = oldList.replace(`${name} `, '')
    if (!hasClassName(oldList, name)) return
    element.className = newList.substring(1)
}

/**
 * 获取一组文本在页面上显示时的最大宽度
 */
export function getMaxWidth({
    textList,
    fontSize = 14,
    fontFamily = 'Nunito sans',
}) {
    let s: any = document.querySelector('.line-chart-tooltip-text')
    if (!s) {
        s = document.createElement('span') as HTMLSpanElement
        s.style.fontSize = fontSize + 'px'
        s.style.fontFamily = fontFamily
        s.style.display = 'inline-block'
        s.style.position = 'fixed'
        s.style.opacity = '0'
        s.className = 'line-chart-tooltip-text'
        document.body.append(s)
    }
    const widthList = textList.map(text => {
        s.innerHTML = text
        const width = s.clientWidth
        return width
    })
    const maxWidth = Math.max(...widthList)
    return maxWidth
}
