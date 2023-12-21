import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type OffencesProps = {
    first_name: string;
    last_name: string;
    accused_id: number;
    key:number
};

export const Convictions = ({ first_name, last_name, accused_id, key }: OffencesProps) => {
    const [pendings, setPendings] = useState<{ [key: number]: any[] }>({});
    const [convictions, setConvictions] = useState<{ [key: number]: any[] }>({});
    const [accusedCount, setAccusedCount] = useState<number>(0); // Initialize with 1
    const [globalAccusedCount, setGlobalAccusedCount] = useState(0);


    useEffect(() => {

        const fetchPendings = async () => {
            let charges = await axios.get(API_URL + "/api/accuseds/convictions/" + accused_id);
            const groupedOffences = { ...pendings };

            groupedOffences[accused_id] = charges.data.convictions;
            setPendings(groupedOffences);

            console.log(groupedOffences);

            // Increment the accused count when new data is fetched
            setAccusedCount((count) => count + 1);
        };



        fetchPendings();
        
    }, [accused_id]);

    // Increment global accused count when a new accused is rendered
    useEffect(() => {
        setGlobalAccusedCount(count => count + 1);
    }, [accused_id]);

    return (
        <>
            {Object.keys(pendings).map((index, accused_id) => (
                                            

                <div key={index}  style={{margin:"0 0 20px 0", padding:"0"}}>
                    
                    {/* <div style={{fontSize:"11pt"}}><span style={{fontSize:"10pt", fontWeight:"bold"}}>Accused </span>- {first_name + " " + last_name}</div> */}
                    <div style={{}}>
                    <label style={{ fontSize: "10pt", margin:"0 0 7px 0" }}>Convictions</label>


                    {pendings[parseInt(index)].map((offence: any, index) => (
                        <>
                        
                            <div style={{margin:"0 0 10px 0", borderBottom:"1px solid #666"}}>
                                <table style={{ fontSize: "10pt" }}>
                                    <tr key={offence.index}>
                                        {/* <td style={{ textAlign:"left", width: "90px"}}><div style={{fontWeight:"bold", textAlign:"left",fontSize:"9pt"}}>ICCS Code</div>
                                        <div>{offence.ICCS}</div>
                                        </td> */}
                                        <td style={{ width: "630px", border: "none" }}>
                                            <table style={{ fontSize: "10pt", margin:"0 0 0 0", padding:"0 0 0 7px", borderLeft:"1px solid #888"}}>
                                                <tr key={offence.id}>
                                                    <td style={{ width: "120px", border: "none" }}><label style={{ padding: "0 0 0 7px" }}>Name of Offence</label></td>
                                                    <td style={{ width: "400px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.offence} </div></td>                                                    
                                                </tr>
                                                <tr key={offence.id}>
                                                    <td style={{ width: "170px", border: "none" }}><label style={{ padding: "0 0 0 7px" }}>Period of Offence</label></td>
                                                    <td style={{ width: "470px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.dateOfOffence} </div></td>
                                                </tr>
                                                <tr key={offence.id}>
                                                    <td style={{ width: "120px", border: "none" }}><label style={{ padding: "0 0 0 7px" }}>Sentence</label></td>
                                                    <td style={{ width: "400px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.sentence} </div></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                </table>


                                {/* <div>
                                    <div style={{ textAlign:"left", width: "700px", fontWeight: "bold", fontSize: "10pt", margin:"10px 0 2px 0" }}>Statement of Offence</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: "10pt", lineHeight:"13pt", margin:"0 0 10px"  }}>{offence.statementOfOffence} </div>
                                </div>

                                <div>
                                    <div style={{ textAlign:"left", width: "700px", fontWeight: "bold", fontSize: "10pt", margin:"15px 0 2px" }}>Particulars of Offence</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: "10pt", lineHeight:"13pt",   margin:"0 0 10px" }}>{offence.particulars} </div>
                                </div> */}


                            </div>
                            
                        </>
                        
                    ))}
                    </div>

                </div>
                    
            ))}
        </>
    );
};
