import React from 'react'
import { Link } from 'react-router-dom'
import './Teacher.css'

const TeacherHome = () => {
  const teacher = JSON.parse(sessionStorage.getItem('loggedInTeacher'))

  return (
    <div>
      <div className="teacher-welcome-card">
        <div>
          <h2>Welcome back, {teacher?.name || 'Teacher'}</h2>
          <p>Manage your profile and oversee student project submissions</p>
        </div>
        <span className="teacher-welcome-badge">Faculty</span>
      </div>

      <div className="teacher-stats-grid">
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">Projects Assigned</span>
          <span className="teacher-stat-value">0</span>
          <span className="teacher-stat-sub">Active projects</span>
        </div>
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">Submissions</span>
          <span className="teacher-stat-value">0</span>
          <span className="teacher-stat-sub">Received</span>
        </div>
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">Approved</span>
          <span className="teacher-stat-value">0</span>
          <span className="teacher-stat-sub">Approved projects</span>
        </div>
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">Pending</span>
          <span className="teacher-stat-value">0</span>
          <span className="teacher-stat-sub">Pending review</span>
        </div>
      </div>

      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>Quick Actions</h2>
          <p>Jump straight to what you need</p>
        </div>
        <Link to="/teacher/profile">
          <button className="teacher-primary-btn" style={{ maxWidth: '200px' }}>
            View Profile
          </button>
        </Link>
      </div>
    </div>
  )
}

export default TeacherHome