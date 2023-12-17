import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type OffencesProps = {
    first_name: string;
    last_name: string;
    accused_id: number;
    key:number
};

export const Offences = ({ first_name, last_name, accused_id, key }: OffencesProps) => {
    const [offences, setOffences] = useState<{ [key: number]: any[] }>({});
    const [accusedCount, setAccusedCount] = useState<number>(0); // Initialize with 1
    const [globalAccusedCount, setGlobalAccusedCount] = useState(0);


    useEffect(() => {
        const fetchOffences = async () => {
            let charges = await axios.get(API_URL + "/api/accuseds/charges/" + accused_id);
            const groupedOffences = { ...offences };

            groupedOffences[accused_id] = charges.data.charges;
            setOffences(groupedOffences);

            // Increment the accused count when new data is fetched
            setAccusedCount((count) => count + 1);
        };

        fetchOffences();
    }, [accused_id]);

    // Increment global accused count when a new accused is rendered
    useEffect(() => {
        setGlobalAccusedCount(count => count + 1);
    }, [accused_id]);

    return (
        <>
            {Object.keys(offences).map((index, key) => (
                                            

                <div key={index}  style={{margin:"0 0 20px 0", padding:"10px"}}>
                    
                    <div style={{fontSize:"11pt"}}><span style={{fontSize:"11pt", fontWeight:"bold"}}>Accused </span>- {first_name + " " + last_name}</div>
                    <div style={{}}>
                    <label style={{ fontSize: "10pt" }}>Offences</label>


                    {offences[parseInt(index)].map((offence: any, index) => (
                        <>
                        
                            <div style={{margin:"0 0 10px 0", borderBottom:"1px solid #666"}}>
                                <table style={{ fontSize: "10pt" }}>
                                    <tr key={offence.id}>
                                        <td style={{ textAlign:"center", width: "100px", border: "1px solid #777" }}><div style={{fontWeight:"bold", textAlign:"center",fontSize:"9pt"}}>ICCS Code</div>
                                        <div>{offence.ICCS}</div>
                                        </td>
                                        <td style={{ width: "630px", border: "none" }}>
                                            <table style={{ fontSize: "10pt" }}>
                                                <tr key={offence.id}>
                                                    <td style={{ width: "120px", border: "none" }}><label>Name of Offence</label></td>
                                                    <td style={{ width: "400px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.name} </div></td>
                                                </tr>
                                                <tr key={offence.id}>
                                                    <td style={{ width: "170px", border: "none" }}><label>Period of Offence</label></td>
                                                    <td style={{ width: "470px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.dateOfOffence} </div></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                </table>


                                <table style={{ fontSize: "10pt" }}>
                                    <tr key={offence.id}>
                                        <td style={{ width: "670px", border: "none", textAlign:"center",  }}>
                                            <label style={{ width: "670px"}}>Particulars of Offence</label>
                                            <td style={{ width: "670px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.particulars} </div></td>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                        </>
                        
                    ))}
                </div>

                    </div>
                    
            ))}
        </>
    );
};
