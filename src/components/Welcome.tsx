import Button from 'react-bootstrap/Button';
// import '../assets/Welcome.css'
import { RegisterSignin } from './RegisterSignin';

type WelcomeProps = {}

export const Welcome = ({}: WelcomeProps) => {
    return (
    <>
        <div className="container">
            
            <br /> <br />
            <h3 className='page-title'>Welcome to the Judiciary Form Portal</h3>             
            <br /> <br />

            {/* <a className="btn btn-outline-primary btn-lg">Connect with TTPS</a> */}

            <RegisterSignin />

        </div>
    </>
    )
}