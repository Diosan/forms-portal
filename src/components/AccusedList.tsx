// import React from "react";
import React, {useEffect, useState} from "react"
import { useAppSelector  } from "../store/store"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import Accused from "./Accused"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import '../assets/Accused.css'


type AccusedListProps = {
    submission_id: number,
    request_signature: any,
    submission_accuseds: any,
    editable: boolean
}

const AccusedList = ({submission_id, request_signature, submission_accuseds, editable}: AccusedListProps) => {


    // const persons = useAppSelector((state) => state.person.persons)
    const accuseds = useAppSelector((state) => state.accused.accuseds)
    const [submissionAccuseds, setSubmissionAccuseds] = useState([])

    useEffect( () => {
        // async () => {
        //     console.log('Loading accuseds list')
        //     // let returned_accuseds = await axios.get(API_URL + '/api/submissions/accuseds/' + submission_id)
        //     // console.log('Returned accuseds: ', accuseds)
        // }

        const fetchData = async () => {
            // console.log('Loading accuseds list ' + API_URL + '/api/submissions/accuseds/' + submission_id)
            let returned_accuseds = await axios.get(API_URL + '/api/submissions/accuseds/' + submission_id)
            // console.log('Returned accuseds: ', returned_accuseds.data.accuseds)
            return returned_accuseds.data.accuseds
        }

        fetchData()
        .then( returned_accuseds => { 
            setSubmissionAccuseds(returned_accuseds)
            // console.log('returned_accuseds: ', returned_accuseds) 
        })
        

    }, [])

    // console.log('Loading accuseds list')

    const requestSignature = () => {
        request_signature()
    }

    return <>
       
        {}

            {submission_accuseds.slice().reverse().map((accused: any, index:any) => (
 
            
                <div className="card accused-card mt-4" key={accused.id}>
                    <div className="accused-index">Acused {index+1}</div>
                    <div className="card-body">
                        <h5 className="card-title text-left fw-bold pb-2" style={{borderBottom:"1px solid #ccc"}}>{accused.firstName} {accused.lastName}</h5>
                        <p className="card-text text-left">
                            <label>Address:</label> {accused.address}
                            <br/><label>Date Of Birth:</label> {accused.dateOfBirth}
                            <br/><label>Gender Identity:</label> {accused.gender}
                            <br/><label>Adult Or Child</label> {accused.adulthood}
                        </p>



                        <Accused 
                            request_signature={requestSignature} 
                            accused_id={accused.id}
                            editable={editable} 
                        />

                    </div>
                </div>

            ))}

    </>
}

export default AccusedList