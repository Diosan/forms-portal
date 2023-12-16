import {useEffect, useState} from "react"
const API_URL = import.meta.env.VITE_API_URL
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
            { offences.map((offence: any, i: number) => (
                <tr key={offence.id} >
                    <td style={{width:"120px"}}>{first_name + ' ' + last_name} </td>
                    <td style={{width:"100px"}}>{offence.ICCS}</td>
                    <td style={{width:"100px"}}>{offence.name}</td> 
                    <td style={{width:"100px"}}>{offence.dateOfOffence}</td>
                    <td style={{width:"260px"}}>{offence.particulars}</td>
                </tr>
            ))}
        </>
        

    )

}