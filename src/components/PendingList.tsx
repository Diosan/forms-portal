import React, {useEffect, useState} from "react";
import { useAppSelector  } from "../store/store";
import "../assets/Charge.css"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"

type PendingListProps = {
    accused_id: number,
    accused_pendings: any[]
}

const PendingList = ({accused_id, accused_pendings}: PendingListProps) => {

    useEffect( () => {

        console.log('accused_pendings: ', accused_pendings);

    },[])

    return (
    
        <div>

            <table className="charge-table">
                <thead>
                    <tr>
                        <th>Offence</th>
                        <th>Date Of Offence</th>
                    </tr>
                </thead>
                <tbody>
                    {/* { accused_pendings.map((pending) => (<></>))} */}
                    {/* {accused_pendings.map((pending: any) => (
                        <tr key={pending.id}>
                            <td>{ pending.offence }</td>
                            <td>{ pending.dateOfOffence}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>

        </div>
    )
}

export default PendingList