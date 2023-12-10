import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from 'react-router-dom';
import '../assets/App.css'
// import { JudiciaryForm } from './JudiciaryForm'
import { RegisterSignin } from './RegisterSignin'
import { Welcome } from './Home'
import { Submission } from './Submission'
import { PasswordReset } from './ResetPassword'
import Transcend  from './Transcend'
import { Submissions } from './Submissions'
import { Summons } from './Summons';
import  SimpleRef  from './SimpleRef'
import { Indictable } from './Indictable'
import { Sign } from './Sign'
import { LeftColumn } from "./LeftColumn"
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import { Header } from './Header'
import { Footer } from './Footer'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { store } from '../store/store'
import { Provider } from 'react-redux'

import { NotPolice } from './NotPolice';



function App() {
  console.log("APP")
  return (
    <>
    {/* <Header /> */}
    <LeftColumn />

      <Routes>
        <Route path= "/" element={<Welcome />} />
        <Route path= "/login" element={<RegisterSignin />} />
        <Route path= "/submission" element={<PrivateRoute><Submission new_submission={true} /></PrivateRoute>} />
        <Route path= "/password/new" element={ <PrivateRoute><PasswordReset/></PrivateRoute>} />
        <Route path= "/password/reset/:token" element={ <PrivateRoute><PasswordReset/></PrivateRoute>} />
        <Route path= "/submission/:id" element={ <PrivateRoute><Submission new_submission={false }/></PrivateRoute>} />
        <Route  path= "/submissions" element={ <PrivateRoute><Submissions /></PrivateRoute>} />
        <Route path= "/transcend" element={ <PrivateRoute><Transcend /></PrivateRoute> } />
        <Route path= "/simple_ref" element={ <PrivateRoute><SimpleRef /></PrivateRoute> } />
        <Route path= "/sign/:id" element={ <PrivateRoute><Sign /></PrivateRoute> } />
        <Route path= "/indictable" element={ <PrivateRoute><Indictable new_submission={ true } /></PrivateRoute>} />
        <Route path= "/indictable/:id" element={ <PrivateRoute><Indictable new_submission={ false } /></PrivateRoute>} />
    
        <Route path= "/not_police" element={ <PrivateRoute><NotPolice new_submission={ true }/></PrivateRoute>} />
        <Route path= "/not_police/:id" element={ <PrivateRoute><NotPolice new_submission={false }/></PrivateRoute>} />
        <Route path= "/summons" element={ <PrivateRoute><Summons new_submission={ true }/></PrivateRoute>} />
        <Route path= "/summons/:id" element={ <PrivateRoute><Summons new_submission={false }/></PrivateRoute>} />
        
      </Routes>
    <Footer />
    </>
   
  )
}

export default App
