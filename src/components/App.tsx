
const OPERATION_MODE = import.meta.env.VITE_OPERATION_MODE 
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from 'react-router-dom';
import '../assets/App.css'
// import { JudiciaryForm } from './JudiciaryForm'
import { RegisterSignin } from './RegisterSignin'
import { Welcome } from './Home'
import { Submission } from './Submission'
import { PrivateSubmission } from './PrivateSubmission';
import { Consent } from './Consent';
import { PasswordReset } from './ResetPassword'
import Transcend  from './Transcend'
import { Submissions } from './Submissions'
import { Summons } from './Summons'
import { Warrant } from './Warrant'
import  SimpleRef  from './SimpleRef'
import { Indictable } from './Indictable'
import { IndictableComplaint } from './IndictableComplaint';
import { IndictablePreliminaryCompleted } from './IndictablePreliminaryCompleted';
import { CompletedSubmission } from './CompleteSubmission'
import { CompletedIndictment } from './CompleteIndictment'
import { Sign } from './Sign'
import { PrivateSign } from './PrivateSign';
import { SignDPP } from './SignDPP';
import { SignConsent } from './SignConsent';
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
import { PrivateView } from './PrivateView';

import { ViewConsent } from './ViewConsent';

import { Oathless } from './Oathless';

import { Admin } from './Admin';

import { Complainant } from './Complainant';

function App() {
  console.log("APP")
  const [createPassword, setCreatePassword] = useState<boolean>(false);

  return (
    <>
    {/* <Header /> */}

    { OPERATION_MODE == 'DEMO' ?
      <div style={{ color: 'white', background: 'red', textAlign: 'right', padding: '10px' }} >
        Demo!  Demo! Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  Demo!  
      </div>
      : <></>
    }


    <LeftColumn setCreatePassword={setCreatePassword} />

      <Routes>
        <Route path= "/" element={<Welcome />} />
        <Route path= "/login" element={<RegisterSignin setCreatePassword={setCreatePassword} createPassword={createPassword} />} />
        <Route path= "/password/new" element={ <PasswordReset/>} />
        <Route path= "/password/reset/:token" element={ <PasswordReset/>} />
        <Route path= "/submission" element={<PrivateRoute><Submission new_submission={true} /></PrivateRoute>} />
        <Route path= "/private" element={<PrivateRoute><PrivateSubmission new_submission={true} /></PrivateRoute>} />
        <Route path= "/consent" element={<PrivateRoute><Consent new_submission={true} /></PrivateRoute>} />
        <Route path="/oathless" element={<PrivateRoute><Oathless new_submission={true} /></PrivateRoute>} />
        <Route path= "/submission/:id" element={ <PrivateRoute><Submission new_submission={false }/></PrivateRoute>} />
        <Route  path= "/submissions" element={ <PrivateRoute><Submissions /></PrivateRoute>} />
        <Route path= "/transcend" element={ <PrivateRoute><Transcend /></PrivateRoute> } />
        <Route path= "/simple_ref" element={ <PrivateRoute><SimpleRef /></PrivateRoute> } />
        <Route path= "/sign/:id" element={ <PrivateRoute><Sign /></PrivateRoute> } />
        <Route path= "/private/sign/:id" element={ <PrivateRoute><PrivateSign /></PrivateRoute> } />
        <Route path= "/indictment/sign/:id" element={ <PrivateRoute><SignDPP /></PrivateRoute> } />
        <Route path= "/consent/sign/:id" element={ <PrivateRoute><SignConsent /></PrivateRoute> } />
        <Route path= "/indictable" element={ <PrivateRoute><Indictable new_submission={ true } /></PrivateRoute>} />
        <Route path= "/indictable/:id" element={ <PrivateRoute><Indictable new_submission={ false } /></PrivateRoute>} />
        <Route path= "/indictable_complaint" element={ <PrivateRoute><IndictableComplaint new_submission={ true } /></PrivateRoute>} />
        <Route path= "/indictable_complaint/:id" element={ <PrivateRoute><IndictableComplaint new_submission={ false } /></PrivateRoute>} />
        <Route path= "/indictable_pcompleted" element={ <PrivateRoute><IndictablePreliminaryCompleted new_submission={ true } /></PrivateRoute>} />
        <Route path= "/indictable_pcompleted/:id" element={ <PrivateRoute><IndictablePreliminaryCompleted new_submission={ false } /></PrivateRoute>} />
        <Route path= "/verify/:id" element={ <PrivateRoute><Verify /></PrivateRoute> } />
        <Route path= "/not_police" element={ <PrivateRoute><NotPolice new_submission={ true }/></PrivateRoute>} />
        <Route path= "/not_police/:id" element={ <PrivateRoute><NotPolice new_submission={false }/></PrivateRoute>} />
        <Route path= "/summons" element={ <PrivateRoute><Summons new_submission={ true }/></PrivateRoute>} />
        <Route path= "/warrant" element={ <PrivateRoute><Warrant new_submission={ true }/></PrivateRoute>} />
        <Route path= "/summons/:id" element={ <PrivateRoute><Summons new_submission={false }/></PrivateRoute>} />
        <Route path= "/view/:id" element={ <PrivateRoute><View /></PrivateRoute> } />
        <Route path= "/private_view/:id" element={ <PrivateRoute><PrivateView /></PrivateRoute> } />
        <Route path= "/consent/view/:id" element={ <PrivateRoute><ViewConsent /></PrivateRoute> } />
        <Route path= "/sub/complete" element={ <PrivateRoute><CompletedSubmission /></PrivateRoute> } />
        <Route path= "/ind/complete" element={ <PrivateRoute><CompletedIndictment /></PrivateRoute> } />
        <Route  path= "/admin9876543210" element={ <PrivateRoute><Admin /></PrivateRoute>} />

        <Route  path= "/complainant" element={ <PrivateRoute><Complainant /></PrivateRoute>} />

        
        


      </Routes>
    <Footer />
    </>
   
  )
}

export default App
