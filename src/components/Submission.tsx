// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react";
import Form from 'react-jsonschema-form';
import validator from '@rjsf/validator-ajv8';
import axios from "axios";
import "../assets/Submission.css"
 

type SubmissionProps = {}


const log = (type: any) => console.log.bind(console, type);

export const Submission = ({}: SubmissionProps) => {

  const [schema, setSchema] = useState({});
  
  useEffect(() => {
    axios.get('http://localhost:3000/schema')
    .then((response) => {
      setSchema(response.data);
    })
  }, []);

  return (
    // Typescript schema assignment error does not prevent porper operation of RJSF form
    <>

      {/* <Form 
        schema={schema}
        validator={validator}
        // onChange={log('changed')}
        onSubmit={log('submitted')}
        onError={log('errors')} 
      /> */}

          <div className="container">

                {/* <div className='row'>
                    <ul className="nav nav-tabs justify-content-center ">
                        <li className="nav-item active">
                            <a className="nav-link active jud-tab" aria-current="page" data-bs-toggle="tab" href="#submission_1st">1st Step</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link jud-tab"  data-bs-toggle="tab" href="#submission_2nd">2nd Step</a>
                        </li>
                    </ul>
                </div> */}
    
                {/* <div className='row'> 
                      
                    <div className="tab-content submission">
                        <div id="submission_1st" className="tab-pane fade show active" role="tabpanel">
                        
                          <h3>First Step</h3>
    
                        </div>
                        <div id="submission_2nd" className="tab-pane fade" role="tabpanel">
                            
                          <h3>Second Step</h3>
    
                        </div>
                    </div>

                </div>  */}


                <form id="regForm" action="">

                <br />
                <h3 className='page-title'>Complaint Without Oath</h3>             
                <br /> <br />

                
                <div className="tab" style={{display: 'block'}}>Name:
                <div className="mb-3">
                                    <input type="text" className="form-control" id="firstName" placeholder="First Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                                </div>
                </div>

                <div className="tab">Contact Info:
                  <p><input placeholder="E-mail..." /></p>
                  <p><input placeholder="Phone..." /></p>
                </div>

                <div className="tab">Birthday:
                  <p><input placeholder="dd" /></p>
                  <p><input placeholder="mm" /></p>
                  <p><input placeholder="yyyy" /></p>
                </div>

                <div className="tab">Login Info:
                  <p><input placeholder="Username..." /></p>
                  <p><input placeholder="Password..." /></p>
                </div>

                <div style={{overflow:'auto'}}>
                  <div style={{float:'right'}}>
                    {/* <button type="button" id="prevBtn" className="btn btn-secondary" disabled>❮ Previous</button> */}
                    <button type="button" id="nextBtn" className="btn btn-secondary" >Next ❯</button>
                  </div>
                </div>

                
                <div style={{textAlign:'center', marginTop:'20px'}}>
                  <span className="step"></span>
                  <span className="step"></span>
                  <span className="step"></span>
                  <span className="step"></span>
                </div>

                </form>

          </div>  


    </>
  )
} 