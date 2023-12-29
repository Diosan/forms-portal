// import React from "react";
import React, {useEffect, useState} from "react"
import { useAppSelector  } from "../store/store"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import { useDispatch, useSelector } from 'react-redux';
import Accused from "./Accused"
const API_URL = import.meta.env.VITE_API_URL
import { useAppDispatch, RootState } from "../store";
import { setAccused } from "../slices/accused";


import axios from "axios"
import '../assets/Accused.css'
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';



type AccusedListProps = {
    submission_id: number,
    request_signature: any,
    submission_accuseds: any,
    editable: boolean
    onAccusedRemoved: (accusedId: number) => void
}

const AccusedList = ({submission_id, request_signature, submission_accuseds, editable, onAccusedRemoved}: AccusedListProps) => {


    // const persons = useAppSelector((state) => state.person.persons)
    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();

    // const accuseds = useAppSelector((state) => state.accused.accuseds)
    const [submissionAccuseds, setSubmissionAccuseds] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate()
    const accuseds = useSelector((state: RootState) => state.accused.accused);

    const saveAccusedList = (accusedList:any) => {
        dispatch(setAccused(accusedList));
      };

    useEffect( () => {
      
        console.log('Loading... '+ refreshKey)

        const fetchData = async () => {
            const returned_accuseds = await axios.get(API_URL + '/api/submissions/accuseds/' + submission_id)
            const foundAccuseds = returned_accuseds.data.accuseds
            saveAccusedList(foundAccuseds);
            // Update local state if needed
            console.log('Returned accuseds: ', returned_accuseds.data.accuseds)
            return returned_accuseds.data.accuseds
        }

        fetchData()
        .then( returned_accuseds => { 
            setSubmissionAccuseds(returned_accuseds)
            console.log('returned_accuseds: ', returned_accuseds) 
        })
        

    }, [dispatch, submission_id])

    // console.log('Loading accuseds list')

    const requestSignature = () => {
        request_signature()
    }


    // const removeAccuseds = (id:any) => {
    //     axios.get(API_URL + '/accused/remove')
    //     .then((response) => {
    //       console.log(response.data)
    //       setAccusedRemoved(true)
    //     })
    // }

    const removeAccused = async (accusedId:any) => {
        console.log(accusedId)
        // setRefreshKey(oldKey => oldKey + 1);
        // return
        try {
          const response = await fetch(`${API_URL}/api/accuseds/remove-accused/${accusedId}`, { method: 'DELETE' });
          
          if (response.ok) {
            console.log("Accused removed successfully");
            onAccusedRemoved(accusedId); // Invoke the callback
            setRefreshKey(oldKey => oldKey + 1);
            } else {
                console.error("Failed to remove accused");
            }
          
        //   if (response.ok) {
        //     console.log("Accused removed successfully");
        //     setRefreshKey(oldKey => oldKey + 1);
        //     // navigate(`/submission/${submission_id}`)
        //     // Optionally, update the state to reflect the change in the UI
        //   } else {
        //     console.error("Failed to remove accused");
        //     setRefreshKey(oldKey => oldKey + 1);
        //   }
        } catch (error) {
          console.error("Error removing accused:", error);
        }
      };



    return <>
       
        {}

            {submission_accuseds.slice().reverse().map((accused: any, index:any) => (
                <div key={index}>
                    <div className="text-left mt-2 mb-1"><button className="btn btn-link" 
                        style={{ padding:"0"}}  type="submit" 
                        onClick={() => removeAccused(accused.id)}><FontAwesomeIcon icon={faTrashCan} /> Remove this accused</button>
                    </div>
                    <div className="card accused-card mt-0 " key={accused.id}>
                        <div className="accused-index">Accused {index+1}</div>
                        <div className="card-body">
                            <h5 className="card-title text-left fw-bold pb-2" style={{borderBottom:"1px solid #ccc"}}>{accused.firstName}{accused.middleName == null ? '' : ' ' + accused.middleName} {accused.lastName}</h5>
                            <p className="card-text text-left p-0 m-0">
                                <label>Address:</label> {accused.addressLine1}
                                                        {accused.addressLine2 == null ? <></> : <>{', ' + accused.addressLine2}</>}
                                                        {accused.addressLine3 == null ? <></> : <>{', ' + accused.addressLine3}</>}
                                                        {accused.cityTown == null ? <></> : <>{', ' + accused.cityTown}</>}
                                                        {accused.postalCode == null ? <></> : <>{', ' + accused.postalCode}</>}
                                                        {accused.communityCode == null ? <></> : <>{', ' + accused.communityCode}</>}
                                                        {accused.countryName == null ? <></> : <>{', ' + accused.countryName}</>}
                                                        {/* {accused.countryCode == null ? <></> : <>{', ' + accused.countryCode}</>} */}
                            </p>
                            <p className="card-text text-left">
                                {accused.email == null ? <></> : <><label>Email:</label> {accused.email} <br/> </>}
                                {accused.identificationType == null ? <></> : <><label>Identification Type:</label> {accused.identificationType} <br/> </>}                            
                                {accused.identification == null ? <></> : <><label>Identification Number:</label> {accused.identification} <br/> </>} 
                                {accused.gender == null ? <></> : <><label>Gender Identity:</label> {accused.gender} <br/> </>} 
                                {accused.adulthood == null ? <></> : <><label>Adult/Child:</label> {accused.adulthood} <br/> </>}
                                {accused.dateOfBirth == null ? <></> : <><label>Date Of Birth:</label> {accused.dateOfBirth} <br/> </>}
                                {accused.aproximateAge == null ? <></> : <><label>Approximate Age:</label> {accused.aproximateAge} <br/> </>}
                                {accused.alias == null ? <></> : <><label>Alias:</label> {accused.alias} <br/> </>}
                                

                            </p>



                            <Accused 
                                request_signature={requestSignature} 
                                accused_id={accused.id}
                                editable={editable} 
                            />

                        </div>
                    </div>
                </div>

            ))}

    </>
}

export default AccusedList