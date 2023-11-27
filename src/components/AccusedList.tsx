// import React from "react";
import React, {useEffect, useState} from "react"
import { useAppSelector  } from "../store/store"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import { API_URL} from "../config/api"
import axios from "axios"
import '../assets/Accused.css'


type AccusedListProps = {
    submission_id: number
}

const AccusedList = ({submission_id}: AccusedListProps) => {


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
        

    })

    // console.log('Loading accuseds list')

    return <>
       

            {submissionAccuseds.slice().reverse().map((accused: any) => (
                // <tr key={person.id}>
                //     <td>{person.id}</td>
                //     <td>{person.name}</td>
                // </tr>
            
                <div className="card accused-card" key={accused.id}>
                    <div className="card-body">
                        <h5 className="card-title">{accused.firstName} {accused.lastName}</h5>
                        <p className="card-text text-left">
                            <br/><label>Address:</label> {accused.address}
                            <br/><label>Date Of Birth:</label> {accused.dateOfBirth}
                            <br/><label>Gender:</label> {accused.gender}
                            <br/><label>Adulthood:</label> {accused.adulthood}
                        </p>
                        
                        <div className="add-charge">
                            <AddCharge accused_id={accused.id} />
                        </div>

                        <ChargeList accused_id={accused.id} />

                    </div>
                </div>

            ))}

    </>
}

export default AccusedList