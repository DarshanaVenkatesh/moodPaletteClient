const AuthReducer = (state, action) => { // depending on action,, reducer will update state
    switch (action.type) {

      case "LOGIN_START":
        return { 
          user: null,
          isFetching: true,
          error: false,
          authenticated: false,
          totalLogins: state.totalLogins
        };
      case "LOGIN_SUCCESS":
        return {
          user: action.payload,
          isFetching: false,
          error: false,
          authenticated: true,
          totalLogins: 1
        };
      case "LOGIN_FAILURE":
        return {
          user: null,
          isFetching: false,
          error: true,
          authenticated: false,
          totalLogins: state.totalLogins + 1
        };

        case "LOGOUT":
          return {
            user: null,
            isFetching: false,
            error: false,
            authenticated:false,
            totalLogins: 1
          };
  
      default:
        return state;
    }
  };
  
  export default AuthReducer;