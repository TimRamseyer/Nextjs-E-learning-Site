import {createContext, useState} from 'react'
import {NEXTAUTH_URL} from '../../utils/urls'




const AuthContext = createContext()


export const AuthProvider = (props) => {

    const [user, setUser] = useState(false)
    const [isAuthenticated, SetIsAuthenticated] = useState(null)
    const [userId, SetUserId] = useState(null)
    const [userName, SetUserName] = useState(null)
const [preURL, setPreURL] = useState(NEXTAUTH_URL)











    return (
        <AuthContext.Provider value={{ user, setUser,
        isAuthenticated, SetIsAuthenticated, userId, SetUserId, userName, SetUserName, preURL, setPreURL
        }}>
            {props.children}
        </AuthContext.Provider>
    )
} 

export default AuthContext