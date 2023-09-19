import { listDreamlinGoods } from 'apis'
import { useDreamlinGoodPageData } from 'store/pageDataSlice.hook'

export const useDreamlinGoodApiData = () => {
    const [ , setPageData ] = useDreamlinGoodPageData()

    const fetchDreamlinGoods = async (keyword?: string) => {
        const result = await listDreamlinGoods(keyword)
        if (!result) return 

        // 数据结构做处理
        const skusData = result
            .filter(item => Array.isArray(item.skus))
            .map(item => {
                return item.skus.map(item2 => {
                    return {
                        ...item2,
                        goodName: item.name,
                        goodCode: item.code,
                        goodThumbnail: item.thumbnail,
                    }
                })
            })
            .flat(10)

        setPageData({ 
            apiData: result, 
            skusData,
        })
    }
    
    return {
        fetchDreamlinGoods,
    }
}
