import { createContext, useContext } from "react"
import ActivityStore from "./activityStore"

interface Stores{
    activityStore: ActivityStore
}

export const stores : Stores = {
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(stores)

export default function useStores(){
    return useContext(StoreContext)
}