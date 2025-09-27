import React from 'react'
import {Route, BrowserRouter, Routes} from 'react-router-dom'
import Login from '../pages/Login'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes