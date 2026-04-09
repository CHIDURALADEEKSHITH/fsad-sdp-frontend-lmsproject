import React from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './Teacher.css'
import TeacherHome from './TeacherHome'
import TeacherProfile from './TeacherProfile'
import ViewSubjects from './ViewSubjects'
import SubjectProjects from './SubjectProjects'
import ProjectGroups from './ProjectGroups'
import PageNotFound from '../pages/PageNotFound'
import { useAuth } from '../context/AuthContext'
//
const TeacherNavBar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="teacher-layout">
      <nav className="teacher-navbar">
        <div className="teacher-brand">Group Project Portal</div>
        <ul className="teacher-nav-links">
          <li><Link to="/teacher/home">Home</Link></li>
          <li><Link to="/teacher/profile">Profile</Link></li>
          <li><Link to="/teacher/viewsubjects">Subjects</Link></li>
          <li><button type="button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
      <main className="teacher-page-wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/teacher/home" replace />} />
          <Route path="/teacher/home" element={<TeacherHome />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/viewsubjects" element={<ViewSubjects />} />
          <Route path="/teacher/subjectprojects/:coursecode" element={<SubjectProjects />} />
          <Route path="/teacher/projectgroups/:projectId" element={<ProjectGroups />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default TeacherNavBar