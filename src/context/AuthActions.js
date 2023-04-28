export const LoginStart = (userCredentials) => ({ // the method takes in the user's username and password
    type: "LOGIN_START",
});


export const LoginSuccess = (user) => ({ 
    type: "LOGIN_SUCCESS",  
    payload: user, // passed to reducer?
});

export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error, // passed to reducer?
});

export const Logout = () => ({
    type: "LOGOUT",
    payload: state.user
});