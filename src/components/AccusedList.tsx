import React from "react";
import { useAppSelector  } from "../store/store";
import AddCharge from "./AddCharge";
import ChargeList from "./ChargeList";


const AccusedList = () => {
    // const persons = useAppSelector((state) => state.person.persons)
    const accuseds = useAppSelector((state) => state.accused.accuseds)
    return <>
       

            {accuseds.slice().reverse().map((accused) => (
                // <tr key={person.id}>
                //     <td>{person.id}</td>
                //     <td>{person.name}</td>
                // </tr>
            
                <div className="card accused-card" key={accused.id}>
                    <div className="card-body">
                        <h5 className="card-title">{accused.name}</h5>
                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                        <p className="card-text">{accused.address}</p>
                        {/* <a href="#" className="card-link">Card link</a>
                        <a href="#" className="card-link">Another link</a> */}
                        
                        <div className="add-charge">
                            <AddCharge accused_id={accused.id} />
                        </div>
                        <ChargeList />


                    </div>
                </div>

            ))}

    </>
}

export default AccusedList