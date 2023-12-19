import Button from 'react-bootstrap/Button';
// import '../assets/Welcome.css'
import { RegisterSignin } from './RegisterSignin';
import {faEye} from  '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type CompletedProps = {}




export const CompletedSubmission = ({ }: CompletedProps) => {

    const location = useLocation();
    const id = location.state?.id;

    const viewCompletedSubmission = (event: any) => {
        <Navigate to={`/submission/${id}`} replace={true} />
      }


    return (
        <>
            <div className="submissions-container">

                <h2>Completed</h2>
                <p>Your submission has been successfully received and forwarded to the E-filing portal. 
                    If you have any questions or need assistance, feel free to contact our support team. 
                </p>

                <p>
                <button style={{ color: "#fff", textDecoration: "none" }} onClick={viewCompletedSubmission} type="button" className="btn btn-link btn-xs">
                    <FontAwesomeIcon icon={faEye} /> View Submission
                </button>                    

                </p>


            </div>
        </>
    )
}