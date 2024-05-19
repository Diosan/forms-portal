// forced update for push

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type OffencesProps = {


    
    first_name: string;
    last_name: string;
    accused_id: number;
    alias: string;
    key: number



};

export const IndictmentOffences = ({ first_name, last_name, alias, accused_id, key }: OffencesProps) => {
    const [offences, setOffences] = useState<{ [key: number]: any[] }>({});
    const [accusedCount, setAccusedCount] = useState<number>(0); // Initialize with 1
    const [globalAccusedCount, setGlobalAccusedCount] = useState(0);


    useEffect(() => {
        const fetchOffences = async () => {
            let charges = await axios.get(API_URL + "/api/accuseds/charges/" + accused_id);
            const groupedOffences = { ...offences };

            groupedOffences[accused_id] = charges.data.charges;
            setOffences(groupedOffences);

            console.log(charges?.data?.charges?.length || 0);

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
            {Object.keys(offences).map((index, accused_id) => (


                <div key={accused_id} style={{ margin: "0 0 20px 0", padding: "0", borderBottom: "1px solid #666" }}>

                    <div className="d-block">
                        {/* <td style={{ width: "160px" }}><label>Name of Accused: </label></td> */}
                        <table className="mb-1">
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    <span>{first_name}</span>
                                </td>
                                <td style={{ fontWeight: "bold", paddingLeft: "20px" }}>
                                    <span>{last_name}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold", fontSize: "9pt"}}>
                                    <span  style={{ borderTop:"1px solid #000", width:"100%" }}>Accused First Name</span>
                                </td>
                                <td style={{ fontWeight: "bold", fontSize: "9pt", paddingLeft: "20px"}}>
                                    <span  style={{ borderTop:"1px solid #000", width:"100%" }}>Accused Last Name</span>
                                </td>
                            </tr>
                            </table>
                            <table className="mb-2">
                            <tr  style={{ fontWeight: "bold", fontSize: "10pt", paddingLeft: "20px"}}>
                                <td colSpan={2}>
                                    {alias !== "" && (
                                        <strong>otherwise called &nbsp;{alias}&nbsp;</strong>
                                    )}
                                    is charged with the following offences:
                                </td>

                            </tr>
                        </table>

                       
                    </div>



                    {/* <div style={{fontSize:"11pt"}}><span style={{fontSize:"10pt", fontWeight:"bold"}}>Accused </span>- {key + " " + last_name}</div> */}
                    <div style={{}}>
                        {/* <label style={{ fontSize: "10pt", margin:"0 0 7px 0" }}>Offences</label> */}


                        {offences[parseInt(index)].map((offence: any, offenceIndex) => (
                            <div key={offenceIndex}>

                                <div style={{ margin: "0 0 10px 0" }}>
                                    <div style={{ fontWeight: "bold", fontSize: "10pt", textDecoration: "underline", margin: "0 0 10px 0" }}>Count {offenceIndex + 1}</div>

                                    <table style={{ fontSize: "10pt" }}>
                                        <tr key={offence.index}>
                                            <td style={{ textAlign: "left", width: "90px" }}><div style={{ fontWeight: "bold", textAlign: "left", fontSize: "9pt" }}>ICCS Code</div>
                                                <div>{offence.ICCS}</div>
                                            </td>
                                            <td style={{ width: "630px", border: "none" }}>
                                                <table style={{ fontSize: "10pt", margin: "0 0 0 0", padding: "0 0 0 7px", borderLeft: "1px solid #888" }}>
                                                    <tr key={offence.id}>
                                                        <td style={{ width: "120px", border: "none" }}><label style={{ padding: "0 0 0 7px" }}>Name of Offence</label></td>
                                                        <td style={{ width: "400px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.name} </div></td>
                                                    </tr>
                                                    {/* <tr key={offence.id}>
                                                    <td style={{ width: "170px", border: "none" }}><label style={{ padding: "0 0 0 7px" }}>Period of Offence</label></td>
                                                    <td style={{ width: "470px", border: "none" }}><div style={{ fontSize: "10pt" }}>{offence.dateOfOffence} </div></td>
                                                </tr> */}
                                                </table>
                                            </td>
                                        </tr>

                                    </table>


                                    <div>
                                        <div style={{ textAlign: "left", width: "650px", fontWeight: "bold", fontSize: "10pt", margin: "10px 0 2px 0" }}>Statement of Offence</div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "10pt", lineHeight: "13pt", margin: "0 0 10px" }}>{offence.statementOfOffence} </div>
                                    </div>

                                    <div>
                                        <div style={{ textAlign: "left", width: "650px", fontWeight: "bold", fontSize: "10pt", margin: "15px 0 2px" }}>Particulars of Offence</div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "10pt", lineHeight: "13pt", margin: "0 0 10px" }}>{offence.particulars} </div>
                                    </div>


                                </div>

                            </div>

                        ))}
                    </div>

                </div>

            ))}
        </>
    );
};
