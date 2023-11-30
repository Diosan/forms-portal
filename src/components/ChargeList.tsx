import React, {useEffect, useState} from "react";
import { useAppSelector  } from "../store/store";
import "../assets/Charge.css"
import { API_URL} from "../config/api"
import axios from "axios"

type ChargeListProps = {
    accused_id: number,
    accused_charges: any[]
}

const ChargeList = ({accused_id, accused_charges}: ChargeListProps) => {
    const charges = useAppSelector((state) => state.charge.charges)

    const [accusedCharges, setAccusedCharges] = useState([])

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
                        <th>Charge Name</th>
                        <th>ICCS</th>
                        {/* <th>UNODC</th> */}
                        <th>Counts</th>
                        <th>Particulars Of Offence</th>
                    </tr>
                </thead>
                <tbody>
                    {accused_charges.map((charge: any) => (
                        <tr key={charge.id}>
                            <td>{ charge.name }</td>
                            <td>{ charge.ICCS }</td>
                            {/* <td>{ charge.UNODC }</td> */}
                            <td>{ charge.counts }</td>
                            <td>{ charge.particulars }</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default ChargeList