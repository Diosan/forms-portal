import Button from 'react-bootstrap/Button';
// import '../assets/Welcome.css'
import { RegisterSignin } from './RegisterSignin';
import judiciaryLogo from '../images/jtt_logo_n.svg'
import eservicesLogo from '../images/eservices-logo.svg'
import jttSmall from '../images/jtt-sq.svg'
import jttRed from '../images/jtt-red.svg'

type WelcomeProps = {}

export const Welcome = ({}: WelcomeProps) => {
    return (
    <>
        <div className="swf-container">

            {/* <a className="btn btn-outline-primary btn-lg">Connect with TTPS</a> */}
            <div className='swf-container-inner' style={{margin:"100px 0 0 0"}}>
            <div className='swf-home'>
                <h1 className="text-center">
                    Welcome to <span style={{color:"#b2292e"}}>SW</span><span style={{color:"#777", fontFamily:"times", fontStyle:"italic"}}>i</span><span style={{color:"#b2292e"}}>F</span>
                </h1>
                <h2 className="text-center mb-4">
                    Simple and Secure Web Forms
                </h2>
                <div className="text-center mb-3">
                    <img style={{color:"#000", maxWidth:"30px"}} src={jttRed}/>
                </div>
                <h6 className="text-center">
                    Judiciary of Trinidad and Tobago
                </h6>
            </div>
            </div>
            </div>
            
            

    </>
    )
}