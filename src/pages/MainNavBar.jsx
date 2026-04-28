import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import './Style.css'
import Home from './Home'
import AdminLogin from './AdminLogin'
import StudentLogin from './StudentLogin'
import TeacherLogin from './TeacherLogin'
import PageNotFound from './PageNotFound'

const MainNavBar = () => {
  return ( 
    <>
      <nav className="navbar">
        <div className="navbar-brand">Group Project  Submission Portal</div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/adminlogin">Admin</Link></li>
          <li><Link to="/studentlogin">Student</Link></li>
          <li><Link to="/teacherlogin">Teacher</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/teacherlogin" element={<TeacherLogin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default MainNavBar

