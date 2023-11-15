import React from "react";
import { useAppSelector  } from "../store/store";
import "../assets/Charge.css"



const ChargeList = () => {
    // const charges = useAppSelector((state) => state.charge.charges)
    const charges = useAppSelector((state) => state.charge.charges)
    return (
    
        <div>

            <table className="charge-table">
                <thead>
                    <th>Charge Name</th>
                    <th>ICCS</th>
                    <th>UNODC</th>
                    <th>Counts</th>
                </thead>
                <tbody>
                    {charges.map((charge) => (
                    <tr>
                        <td>{ charge.name }</td>
                        <td>{ charge.ICCS }</td>
                        <td>{ charge.UNODC }</td>
                        <td>{ charge.count }</td>
                    </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default ChargeList