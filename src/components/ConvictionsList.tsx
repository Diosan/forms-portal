import React, {useEffect, useState} from "react";
import { useAppSelector  } from "../store/store";
import "../assets/Charge.css"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"

type ConvictionsListProps = {
    accused_id: number,
    accused_convictions: any[]
}

const ConvictionList = ({accused_id, accused_convictions}: ConvictionsListProps) => {
    // const charges = useAppSelector((state) => state.charge.charges)

    // const [accusedCharges, setAccusedCharges] = useState([])

    useEffect( () => {

        // const fetchData = async () => {
        //     let returned_charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused_id)
        //     return returned_charges.data.charges
        // }

        // fetchData()
        // .then( returned_accuseds => { 
        //     setAccusedCharges(returned_accuseds)
        //     // console.log('returned_accuseds: ', returned_accuseds) 
        // })

    },[])

    return (
    
        <div>

            <table className="charge-table">
                <thead>
                    <tr>
                        <th>Offence</th>
                        <th>Date Of Offence</th>
                        <th>Sentence</th>
                    </tr>
                </thead>
                <tbody>
                    {accused_convictions.map((conviction: any) => (
                        <tr key={conviction.id}>
                            <td>{ conviction.offence }</td>
                            <td>{ conviction.dateOfOffence}</td>
                            <td>{ conviction.sentence }</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default ConvictionList