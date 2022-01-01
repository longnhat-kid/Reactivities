import { createContext, useContext } from "react"
import ActivityStore from "./activityStore"
import CommonStore from "./commonStore"

interface Stores{
    activityStore: ActivityStore,
    commonStore: CommonStore
}

export const stores : Stores = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(stores)

export default function useStores(){
    return useContext(StoreContext)
}