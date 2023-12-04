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
import { Provider } from 'react-redux'
import { store } from "./store";
import { RootState } from './store';




const router = createBrowserRouter([
  
  {
    path: "/*", // Use wildcard to handle all routes in App
    element: <App />
  }
  
  
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      
      {/* <App /> */}
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
