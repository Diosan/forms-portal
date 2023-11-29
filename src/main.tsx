import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { Header } from './components/Header'
import { Submission } from './components/Submission'
import { Indictable } from './components/Indictable'
import Transcend from "./components/Transcend"
import SimpleRef from './components/SimpleRef'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import './assets/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Submissions } from './components/Submissions'
import { Sign } from './components/Sign'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/submission",
    element: <Submission new_submission={true} />
  },
  {
    path: "/submission/:id",
    element: <Submission new_submission={false} />
  },
  {
    path: "/submissions",
    element: <Submissions />
  },
  {
    path: "/transcend",
    element: <Transcend />
  },
  {
    path: "/simple_ref",
    element: <SimpleRef />
  },
  {
    path: "/sign/:id",
    element: <Sign />
  },
  {
    path: "/indictable",
    element: <Indictable new_submission={true} />
  },
  {
    path: "/indictable/:id",
    element: <Indictable new_submission={false} />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
