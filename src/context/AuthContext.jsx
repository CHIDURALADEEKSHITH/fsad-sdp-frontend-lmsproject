import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => sessionStorage.getItem('loggedInRole'))

  const loginAs = (nextRole) => {
    setRole(nextRole)
    sessionStorage.setItem('loggedInRole', nextRole)
  }

  const logout = () => {
    const currentRole = role || sessionStorage.getItem('loggedInRole')
    if (currentRole === 'admin') {
      sessionStorage.removeItem('loggedInAdmin')
    } else if (currentRole === 'student') {
      sessionStorage.removeItem('loggedInStudent')
    } else if (currentRole === 'teacher') {
      sessionStorage.removeItem('loggedInTeacher')
    }
    sessionStorage.removeItem('loggedInRole')
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}