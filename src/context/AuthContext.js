import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = { // before login, define variables we are keeping track of
    user:JSON.parse(localStorage.getItem("user")) || null,
    // user: null,
    isFetching:false,
    error: false,
    authenticated: false,
    totalLogins: 1
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user])


    console.log(state.totalLogins) // I don't know why, but I think I need to do this to ensure that totalLogins isn't undefined elsewhere

    return(
        <AuthContext.Provider value={{user:state.user, isFetching: state.isFetching, error: state.error, 
                                        authenticated:state.authenticated, totalLogins: state.totalLogins, dispatch}}> 
            {children}
        </AuthContext.Provider>
    )
}   