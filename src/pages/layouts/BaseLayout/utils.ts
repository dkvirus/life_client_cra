import { sideBarMenus } from 'configs/menus'
import { arrayUtils } from 'druikit'

export function getMenuItems(privs: string[]) {
    return sideBarMenus.filter(it => {
        if (!it?.privs) return true
        return arrayUtils.intersection(it?.privs, privs)?.length
    })
}
