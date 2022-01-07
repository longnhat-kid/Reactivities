import { createContext, useContext } from "react"
import ActivityStore from "./activityStore"
import CommonStore from "./commonStore"
import ModalStore from "./modalStore"
import ProfilesStore from "./profilesStore"
import UserStore from "./userStore"

interface Stores{
    activityStore: ActivityStore,
    commonStore: CommonStore,
    userStore: UserStore,
    modalStore: ModalStore,
    profilesStore: ProfilesStore
}

export const stores : Stores = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profilesStore: new ProfilesStore()
}

export const StoreContext = createContext(stores)

export default function useStores(){
    return useContext(StoreContext)
}