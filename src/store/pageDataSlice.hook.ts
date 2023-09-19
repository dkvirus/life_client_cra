/**
 * 简化 pageDataSlice 数据的获取与存储
 */
import { useDispatch, useSelector } from 'react-redux'
import { selectPageData, updatePageData } from 'store/dreamlinSlice'

export const usePageData = (pageName): [any, (value: any) => void] => {
    const dispath = useDispatch()
    const pageData = useSelector(selectPageData)

    const setPageData = (value: any) => {
        dispath(updatePageData({
            pageName,
            payload: value,
        }))
    }

    return [
        pageData[pageName],
        setPageData,
    ]
}

export const useDreamlinGoodPageData = () => {
    return usePageData('dreamlinGood')
}
