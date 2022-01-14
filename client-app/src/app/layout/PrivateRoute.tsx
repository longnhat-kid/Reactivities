import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import useStores from "../stores/stores";

interface Props extends RouteProps{
    component: React.ComponentType<any> | React.ComponentType<RouteComponentProps<any>>;
}

export default function PrivateRoute({component: Component, ...rest}: Props){
    const {userStore} = useStores();
    const {isLoggedIn} = userStore;
    return (
        <Route
            {...rest}
            render = {(props) => isLoggedIn ? <Component {...props} /> : <Redirect to='/'/>}
        />
    )
}