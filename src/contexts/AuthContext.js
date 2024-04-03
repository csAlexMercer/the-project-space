import { createContext, useEffect, useReducer } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN':
            return {...state, user: action.payload}
        case 'LOGOUT':
            return {...state, user: null}
        case 'AUTH_IS_READY':
            return {...state, user: action.payload, authIsReady: true}
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false
    })

    useEffect(() => {
        const unsub = projectAuth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                // Fetch user data from Firestore
                const userRef = projectFirestore.collection('users').doc(userAuth.uid);
                const userDoc = await userRef.get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    dispatch({ type: 'AUTH_IS_READY', payload: { ...userData, uid: userAuth.uid }});
                } else {
                    console.log("No such document!");
                }
            } else {
                dispatch({ type: 'AUTH_IS_READY', payload: null });
            }
        });

        return unsub;
    }, [])

    console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value= {{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}
