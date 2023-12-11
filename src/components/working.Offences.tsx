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
                <div className="d-flex swf-tbl" key={accused.id} >
                    <div className="flex-row first" style={{width:"132px"}}>{first_name}</div>
                    <div className="flex-row" style={{width:"129px"}}>{last_name}</div>
                    <div className="flex-row text-center" style={{width:"120px"}} >{accused.ICCS}</div>
                    <div className="flex-row" style={{width:"120px"}} >{accused.dateOfOffence}</div>
                    <div className="flex-row last" style={{width:"300px"}}>{accused.particulars}</div>
                </div>
        ))}
        </>
        

    )

}