import { useState } from 'react'
import reactLogo from './assets/react.svg'
import '../assets/App.css'
// import { JudiciaryForm } from './JudiciaryForm'
import { Welcome } from './Welcome'
import { Header } from './Header'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { store } from './store'
import { Provider } from 'react-redux'



// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   )
// }

function App() {
  // console.log(store.getState())
  return (
    <>
      {/* <Provider store={store}> */}
        {/* <Header />      */}
        <Welcome />
      {/* </Provider>             */}
    </>
   
  )
}

export default App
