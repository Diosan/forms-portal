import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"

type OffencesProps = {
    first_name: string
    last_name: string
    accused_id: number
}

export const Offences = ({first_name, last_name, accused_id}: OffencesProps) => {
    const [offences, setOffences] = useState([])

    useEffect(() => {

        const fetchOffences = async () => {
            let charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused_id)
            setOffences(charges.data.charges)
        } 
        
        fetchOffences()

    },[])

    return (
        <>
            { offences.map((accused: any, i: number) => (
                <tr key={accused.id} >
                    <td style={{width:"120px"}}>{first_name + ' ' + last_name} </td>
                    <td style={{width:"100px"}}>{accused.UNODC}</td>
                    <td style={{width:"100px"}}>{accused.dateOfOffence}</td>
                    <td style={{width:"260px"}}>{accused.particulars}</td>
                </tr>
            ))}
        </>
        

    )

}