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
import { Summons } from './Summons'
import { Warrant } from './Warrant'
import  SimpleRef  from './SimpleRef'
import { Indictable } from './Indictable'
import { CompletedSubmission } from './CompleteSubmission'
import { Sign } from './Sign'
import { Verify } from './Verify'
import { LeftColumn } from "./LeftColumn"
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import { Header } from './Header'
import { Footer } from './Footer'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { store } from '../store/store'
import { Provider } from 'react-redux'

import { NotPolice } from './NotPolice';
import { Signatures } from './Signatures';

import { View } from './View';

import { Oathless } from './Oathless';

import { Admin } from './Admin';

function App() {
  console.log("APP")
  return (
    <>
    {/* <Header /> */}
    <LeftColumn />

      <Routes>
        <Route path= "/" element={<Welcome />} />
        <Route path= "/login" element={<RegisterSignin />} />
        <Route path= "/password/new" element={ <PasswordReset/>} />
        <Route path= "/password/reset/:token" element={ <PasswordReset/>} />

        <Route path= "/submission" element={<PrivateRoute><Submission new_submission={true} /></PrivateRoute>} />
        <Route path="/oathless" element={<PrivateRoute><Oathless new_submission={true} /></PrivateRoute>} />
        <Route path= "/submission/:id" element={ <PrivateRoute><Submission new_submission={false }/></PrivateRoute>} />
        <Route  path= "/submissions" element={ <PrivateRoute><Submissions /></PrivateRoute>} />
        <Route path= "/transcend" element={ <PrivateRoute><Transcend /></PrivateRoute> } />
        <Route path= "/simple_ref" element={ <PrivateRoute><SimpleRef /></PrivateRoute> } />
        <Route path= "/sign/:id" element={ <PrivateRoute><Sign /></PrivateRoute> } />
        <Route path= "/indictable" element={ <PrivateRoute><Indictable new_submission={ true } /></PrivateRoute>} />
        <Route path= "/indictable/:id" element={ <PrivateRoute><Indictable new_submission={ false } /></PrivateRoute>} />
        <Route path= "/verify/:id" element={ <PrivateRoute><Verify /></PrivateRoute> } />
        <Route path= "/not_police" element={ <PrivateRoute><NotPolice new_submission={ true }/></PrivateRoute>} />
        <Route path= "/not_police/:id" element={ <PrivateRoute><NotPolice new_submission={false }/></PrivateRoute>} />
        <Route path= "/summons" element={ <PrivateRoute><Summons new_submission={ true }/></PrivateRoute>} />
        <Route path= "/warrant" element={ <PrivateRoute><Warrant new_submission={ true }/></PrivateRoute>} />
        <Route path= "/summons/:id" element={ <PrivateRoute><Summons new_submission={false }/></PrivateRoute>} />
        <Route path= "/view/:id" element={ <PrivateRoute><View /></PrivateRoute> } />
        <Route  path= "/admin999" element={ <PrivateRoute><Admin /></PrivateRoute>} />
        <Route path= "/sub/complete" element={ <PrivateRoute><CompletedSubmission /></PrivateRoute> } />

      </Routes>
    <Footer />
    </>
   
  )
}

export default App
