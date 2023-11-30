import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from 'react-router-dom';
import '../assets/App.css'
// import { JudiciaryForm } from './JudiciaryForm'
import { Welcome } from './Welcome'
import { Submission } from './Submission'
import Transcend  from './Transcend'
import { Submissions } from './Submissions'
import  SimpleRef  from './SimpleRef'
import { Indictable } from './Indictable'
import { Sign } from './Sign'

import { Header } from './Header'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { store } from '../store/store'
import { Provider } from 'react-redux'



function App() {
  // console.log(store.getState())
  return (
    <>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/submission" element={<Submission new_submission={true} />} />
      <Route path= "/submission" element={ <Submission new_submission={ true }/>} />
      <Route path= "/submission/:id" element={ <Submission new_submission={false }/>} />
      <Route  path= "/submissions" element={ <Submissions />} />
      <Route path= "/transcend" element={ <Transcend /> } />
      <Route path= "/simple_ref" element={ <SimpleRef /> } />
      <Route path= "/sign/:id" element={ <Sign /> } />
      <Route path= "/indictable" element={ <Indictable new_submission={ true } />} />
      <Route path= "/indictable/:id" element={ <Indictable new_submission={ false } />} />
    </Routes>
    </>
   
  )
}

export default App
