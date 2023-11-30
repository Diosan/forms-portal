import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from 'react-router-dom';
import '../assets/App.css'
// import { JudiciaryForm } from './JudiciaryForm'
import { Welcome } from './Welcome'
import { Header } from './Header'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { store } from './store'
import { Provider } from 'react-redux'



function App() {
  // console.log(store.getState())
  return (
    <>
    <Routes>
      <Route path="/" element={<Welcome />} />
      {/* <Route path="/about" element={<AboutPage />} /> */}
    </Routes>
    </>
   
  )
}

export default App
