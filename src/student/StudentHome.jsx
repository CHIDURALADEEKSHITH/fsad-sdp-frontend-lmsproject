import React from 'react'
import { Link } from 'react-router-dom'
import './Student.css'

const StudentHome = () => {
  const student = JSON.parse(sessionStorage.getItem('loggedInStudent'))

  return (
    <div>
      <div className="student-welcome-card">
        <div>
          <h2>Welcome back, {student?.name || 'Student'}</h2>
          <p>Manage your profile and track your project submissions</p>
        </div>
        <span className="student-welcome-badge">Student</span>
      </div>

      <div className="student-stats-grid">
        <div className="student-stat-card">
          <span className="student-stat-label">Projects Assigned</span>
          <span className="student-stat-value">0</span>
          <span className="student-stat-sub">Active projects</span>
        </div>
        <div className="student-stat-card">
          <span className="student-stat-label">Submissions</span>
          <span className="student-stat-value">0</span>
          <span className="student-stat-sub">Total submitted</span>
        </div>
        <div className="student-stat-card">
          <span className="student-stat-label">Approved</span>
          <span className="student-stat-value">0</span>
          <span className="student-stat-sub">Approved projects</span>
        </div>
        <div className="student-stat-card">
          <span className="student-stat-label">Pending</span>
          <span className="student-stat-value">0</span>
          <span className="student-stat-sub">Pending review</span>
        </div>
      </div>

      <div className="student-section-card">
        <div className="student-section-header">
          <h2>Quick Actions</h2>
          <p>Jump straight to what you need</p>
        </div>
        <Link to="/student/profile">
          <button className="student-primary-btn" style={{ maxWidth: '200px' }}>
            View Profile
          </button>
        </Link>
      </div>
    </div>
  )
}

export default StudentHome