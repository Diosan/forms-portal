import React, {useEffect, useState} from "react";
import { useAppSelector  } from "../store/store";
import "../assets/Charge.css"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';

type ChargeListProps = {
    accused_id: number,
    accused_charges: any[],
    onChargeRemoved: (chargeId: number) => void 
}

const ChargeList = ({accused_id, accused_charges, onChargeRemoved}: ChargeListProps) => {
    // const charges = useAppSelector((state) => state.charge.charges)
    // const [accusedCharges, setAccusedCharges] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);

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

    const removeCharge = async (chargeId:any) => {
        console.log(chargeId)
        // setRefreshKey(oldKey => oldKey + 1);
        // return
        try {
          const response = await fetch(`${API_URL}/api/accuseds/remove-charge/${chargeId}/${accused_id}`, { method: 'DELETE' });
          
          if (response.ok) {
            console.log("Accused removed successfully");
            // setRefreshKey(oldKey => oldKey + 1);
            onChargeRemoved(chargeId); 
            } else {
                console.error("Failed to remove accused");
            }
        } catch (error) {
          console.error("Error removing accused:", error);
        }
      };

    return (
    
        <div className="mt-3">
            <h6 className="fw-bold">Charges</h6>

            <table className="charge-table mt-2 mb-0">
                <thead>
                    <tr>
                        <th>ICCS Code</th>
                        <th>Name Of Offence</th>
                        <th>Counts</th>
                        <th>Date Of Offence</th>
                        <th>Particulars Of Offence</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {accused_charges.map((charge: any) => (
                        
                        <tr key={charge.id}>
                            <td>{ charge.ICCS }</td>
                            <td>{ charge.name }</td>
                            <td>{ charge.counts }</td>
                            <td>{charge.dateOfOffence}</td>
                            <td>{ charge.particulars }</td>
                            <td><button className="btn btn-link" style={{ padding:"0"}}  type="submit" onClick={() => removeCharge(charge.id)}><FontAwesomeIcon icon={faTrashCan} /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default ChargeList