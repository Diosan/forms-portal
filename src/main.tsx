import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { Header } from './components/Header'
import { Submission } from './components/Submission'
import Transcend from "./components/Transcend"
import SimpleRef from './components/SimpleRef'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import './assets/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/submission",
    element: <Submission />
  },
  {
    path: "/transcend",
    element: <Transcend />
  },
  {
    path: "/simple_ref",
    element: <SimpleRef />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
