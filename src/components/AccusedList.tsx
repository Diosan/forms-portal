import React from "react";
import { useAppSelector  } from "../store/store";


const AccusedList = () => {
    // const persons = useAppSelector((state) => state.person.persons)
    const accuseds = useAppSelector((state) => state.accused.accuseds)
    return <div>
        <p>List Of Accused</p>

            {accuseds.map((accused) => (
                // <tr key={person.id}>
                //     <td>{person.id}</td>
                //     <td>{person.name}</td>
                // </tr>
            
                <div className="card" key={accused.id}>
                    <div className="card-body">
                        <h5 className="card-title">{accused.name}</h5>
                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                        <p className="card-text">{accused.address}</p>
                        {/* <a href="#" className="card-link">Card link</a>
                        <a href="#" className="card-link">Another link</a> */}
                    </div>
                </div>
            ))}

    </div>
}

export default AccusedList