import { createContext, useContext } from "react"
import ActivityStore from "./activityStore"
import CommonStore from "./commonStore"
import ModalStore from "./modalStore"
import UserStore from "./userStore"

interface Stores{
    activityStore: ActivityStore,
    commonStore: CommonStore,
    userStore: UserStore,
    modalStore: ModalStore
}

export const stores : Stores = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(stores)

export default function useStores(){
    return useContext(StoreContext)
}