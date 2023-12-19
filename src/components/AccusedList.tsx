// import React from "react";
import React, {useEffect, useState} from "react"
import { useAppSelector  } from "../store/store"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import Accused from "./Accused"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import '../assets/Accused.css'
import { Navigate, useNavigate, useParams } from "react-router-dom"



type AccusedListProps = {
    submission_id: number,
    request_signature: any,
    submission_accuseds: any,
    editable: boolean
    onAccusedRemoved: (accusedId: number) => void // Add this line
}

const AccusedList = ({submission_id, request_signature, submission_accuseds, editable, onAccusedRemoved}: AccusedListProps) => {


    // const persons = useAppSelector((state) => state.person.persons)
    const accuseds = useAppSelector((state) => state.accused.accuseds)
    const [submissionAccuseds, setSubmissionAccuseds] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate()


    useEffect( () => {
        // async () => {
        //     console.log('Loading accuseds list')
        //     // let returned_accuseds = await axios.get(API_URL + '/api/submissions/accuseds/' + submission_id)
        //     // console.log('Returned accuseds: ', accuseds)
        // }
        console.log('Loading... '+ refreshKey)

        const fetchData = async () => {
            // console.log('Loading accuseds list ' + API_URL + '/api/submissions/accuseds/' + submission_id)
            let returned_accuseds = await axios.get(API_URL + '/api/submissions/accuseds/' + submission_id)
            console.log('Returned accuseds: ', returned_accuseds.data.accuseds)
            return returned_accuseds.data.accuseds
        }

        fetchData()
        .then( returned_accuseds => { 
            setSubmissionAccuseds(returned_accuseds)
            // console.log('returned_accuseds: ', returned_accuseds) 
        })
        

    }, [refreshKey, submission_id])

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
          
          
          
          
          
          if (response.ok) {
            console.log("Accused removed successfully");
            setRefreshKey(oldKey => oldKey + 1);
            // navigate(`/submission/${submission_id}`)
            // Optionally, update the state to reflect the change in the UI
          } else {
            console.error("Failed to remove accused");
            setRefreshKey(oldKey => oldKey + 1);
          }
        } catch (error) {
          console.error("Error removing accused:", error);
        }
      };



    return <>
       
        {}

            {submission_accuseds.slice().reverse().map((accused: any, index:any) => (
                <>
                <div className="text-left mt-2 mb-1"><button className="btn btn-link" 
                    style={{ padding:"0"}}  type="submit" 
                    onClick={() => removeAccused(accused.id)}>X Remove this accused</button>
                </div>
                <div className="card accused-card mt-0 " key={accused.id}>
                    <div className="accused-index">Accused {index+1}</div>
                    <div className="card-body">
                        <h5 className="card-title text-left fw-bold pb-2" style={{borderBottom:"1px solid #ccc"}}>{accused.firstName} {accused.lastName}</h5>
                        <p className="card-text text-left p-0 m-0">
                            <label>Address:</label> {accused.addressLine1}<br/>
                                                    {accused.cityTown}<br/>
                                                    {accused.countryCode}
                        </p>
                        <p className="card-text text-left">
                            <label>Date Of Birth:</label> {accused.dateOfBirth}
                            <br/><label>Gender Identity:</label> {accused.gender}
                            <br/><label>Adult Or Child:</label> {accused.adulthood}
                        </p>



                        <Accused 
                            request_signature={requestSignature} 
                            accused_id={accused.id}
                            editable={editable} 
                        />

                    </div>
                </div>
                </>

            ))}

    </>
}

export default AccusedList