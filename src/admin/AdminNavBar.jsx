import React, { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './Admin.css'
import AdminHome from './AdminHome'
import AddStudent from './AddStudent'
import AddTeacher from './AddTeacher'
import ViewAllStudents from './ViewAllStudents'
import ViewAllTeachers from './ViewAllTeachers'
import AddSubject from './AddSubject'
import ViewAllSubjects from './ViewAllSubjects'
import PageNotFound from '../pages/PageNotFound'
import { useAuth } from '../context/AuthContext'

const AdminNavBar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="admin-brand">Group Project Portal</div>
        <ul className="admin-nav-links">
          <li><Link to="/admin/home" onClick={() => setOpenDropdown(null)}>Home</Link></li>

          <li className="admin-dropdown">
            <button type="button" className="admin-dropdown-btn" onClick={() => toggleDropdown('students')}>
              Students {openDropdown === 'students' ? '▴' : '▾'}
            </button>
            {openDropdown === 'students' && (
              <ul className="admin-dropdown-menu">
                <li><Link to="/admin/addstudent" onClick={() => setOpenDropdown(null)}>Add Student</Link></li>
                <li><Link to="/admin/viewallstudents" onClick={() => setOpenDropdown(null)}>View Students</Link></li>
              </ul>
            )}
          </li>

          <li className="admin-dropdown">
            <button type="button" className="admin-dropdown-btn" onClick={() => toggleDropdown('teachers')}>
              Teachers {openDropdown === 'teachers' ? '▴' : '▾'}
            </button>
            {openDropdown === 'teachers' && (
              <ul className="admin-dropdown-menu">
                <li><Link to="/admin/addteacher" onClick={() => setOpenDropdown(null)}>Add Teacher</Link></li>
                <li><Link to="/admin/viewallteachers" onClick={() => setOpenDropdown(null)}>View Teachers</Link></li>
              </ul>
            )}
          </li>

          <li className="admin-dropdown">
            <button type="button" className="admin-dropdown-btn" onClick={() => toggleDropdown('subjects')}>
              Subjects {openDropdown === 'subjects' ? '▴' : '▾'}
            </button>
            {openDropdown === 'subjects' && (
              <ul className="admin-dropdown-menu">
                <li><Link to="/admin/addsubject" onClick={() => setOpenDropdown(null)}>Add Subject</Link></li>
                <li><Link to="/admin/viewallsubjects" onClick={() => setOpenDropdown(null)}>View Subjects</Link></li>
              </ul>
            )}
          </li>

          <li><button type="button" className="admin-logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <main className="admin-page-wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/home" replace />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/addstudent" element={<AddStudent />} />
          <Route path="/admin/addteacher" element={<AddTeacher />} />
          <Route path="/admin/viewallstudents" element={<ViewAllStudents />} />
          <Route path="/admin/viewallteachers" element={<ViewAllTeachers />} />
          <Route path="/admin/addsubject" element={<AddSubject />} />
          <Route path="/admin/viewallsubjects" element={<ViewAllSubjects />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminNavBar

