
export function getTotalPrice(result) {
    const totalPrice = result
        .map(item => {
            const platformPrice = item.platform_price || 0
            const storePrice = item.store_price || 0
            const diffPrice = storePrice - platformPrice
            return diffPrice
        })
        .reduce((curr, next) => curr + next, 0)
        .toFixed(2)
    return totalPrice
}
