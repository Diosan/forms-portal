import Button from 'react-bootstrap/Button';
// import '../assets/Welcome.css'
import { RegisterSignin } from './RegisterSignin';
import {faEye} from  '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type CompletedProps = {}




export const CompletedIndictment = ({ }: CompletedProps) => {

    const location = useLocation();
    const id = location.state?.id;
    const navigate = useNavigate()

    const viewCompletedSubmission = (event: any) => {
        // console.log("where " + id);
        navigate(`/indictment/sign/${id}`)
      }
 

    return (
        <>
            <div className="submissions-container">

                <h2 className="my-3 mb-4">Submision completed</h2>
                {/* <p className="mt-3">Your submission has been successfully received and forwarded to the E-filing portal. 
                    If you have any questions or need assistance, feel free to contact our support team. 
                </p> */}

                <p>
                <button style={{ color: "#blue", textDecoration: "none" }} onClick={viewCompletedSubmission} type="button" className="btn btn-dark btn-md">
                    <FontAwesomeIcon icon={faEye} /> View Indictment
                </button>                    

                </p>


            </div>
        </>
    )
}