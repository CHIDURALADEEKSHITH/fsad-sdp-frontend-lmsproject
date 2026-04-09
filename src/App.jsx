import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainNavBar from './pages/MainNavBar'
import AdminNavBar from './admin/AdminNavBar'
import StudentNavBar from './student/StudentNavBar'
import TeacherNavBar from './teacher/TeacherNavBar'

function AppContent() {
  const { role } = useAuth()

  const renderNavBar = () => {
    if (role === 'admin') return <AdminNavBar />
    if (role === 'student') return <StudentNavBar />
    if (role === 'teacher') return <TeacherNavBar />
    return <MainNavBar />
  }

  return (
    <BrowserRouter>
      {renderNavBar()}
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App