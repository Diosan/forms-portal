import Button from 'react-bootstrap/Button';
import './Welcome.css'
import { RegisterSignin } from './RegisterSignin';

type WelcomeProps = {}

export const Welcome = ({}: WelcomeProps) => {
    return (
    <>
        <div className="container">
            <br /> <br />
            <h3 className='welcome-message'>Welcome to the Judiciary Form Portal</h3> 
            
            <br /> <br />
          

            <a className="btn btn-outline-primary btn-lg">Connect with TTPS</a>





        </div>
    </>
    )
}