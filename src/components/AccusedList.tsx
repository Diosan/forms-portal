import React from "react";
import { useAppSelector  } from "../store/store";


const AccusedList = () => {
    const persons = useAppSelector((state) => state.person.persons)
    return <div>
        <p>List Of Accused</p>

            {persons.map((person) => (
                // <tr key={person.id}>
                //     <td>{person.id}</td>
                //     <td>{person.name}</td>
                // </tr>
            
                <div className="card" key={person.id}>
                    <div className="card-body">
                        <h5 className="card-title">{person.name}</h5>
                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        {/* <a href="#" className="card-link">Card link</a>
                        <a href="#" className="card-link">Another link</a> */}
                    </div>
                </div>
            ))}

    </div>
}

export default AccusedList