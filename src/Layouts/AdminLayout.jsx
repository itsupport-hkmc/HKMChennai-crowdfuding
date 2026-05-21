import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../Components/AdminPageComponents/AdminNavbar'

const AdminLayout = () => {
  return (
    <>
     <AdminNavbar />
      <Outlet />
    </>
  )
}

export default AdminLayout
