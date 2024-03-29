import { createContext, useContext } from "react"
import ActivityStore from "./activityStore"
import CommentStore from "./commentStore"
import CommonStore from "./commonStore"
import ModalStore from "./modalStore"
import ProfilesStore from "./profilesStore"
import UserStore from "./userStore"

interface Stores{
    activityStore: ActivityStore,
    commonStore: CommonStore,
    userStore: UserStore,
    modalStore: ModalStore,
    profilesStore: ProfilesStore,
    commentStore: CommentStore
}

export const stores : Stores = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profilesStore: new ProfilesStore(),
    commentStore: new CommentStore()
}

export const StoreContext = createContext(stores)

export default function useStores(){
    return useContext(StoreContext)
}