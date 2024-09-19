import React from 'react'
import { Outlet } from 'react-router-dom'
import "./ProfessorHome.css"

function ProfessorHome() {

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h2>TRANG GIÁO VIÊN</h2>
        </div>
        <Outlet/>
    </main>
  )
}

export default ProfessorHome