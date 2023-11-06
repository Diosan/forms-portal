import Button from 'react-bootstrap/Button';
import './Welcome.css'

type WelcomeProps = {}

export const Welcome = ({}: WelcomeProps) => {
    return (
    <>
        <div className="container">
            <br /> <br />
            <h3 className='welcome-message'>Welcome to the Judiciary Form Portal</h3> 
            
            <br /> <br />
          

            <div className='row'>
                <ul className="nav nav-tabs justify-content-center welcome">
                    <li className="nav-item active">
                        <a className="nav-link active welcome" aria-current="page" data-bs-toggle="tab" href="#welcome_signin">Sign In</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link welcome"  data-bs-toggle="tab" href="#welcome_register">Register</a>
                    </li>
                </ul>
            </div>

            <div className='row'> 
                  
                <div className="tab-content welcome">
                    <div id="welcome_signin" className="tab-pane fade show welcome active" role="tabpanel">
                    
                        <form>
                            <div className="mb-3">
                                {/* <label for="exampleInputEmail1" className="form-label">Email address</label> */}
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="email" />
                            </div>
                            <div className="mb-3">
                                {/* <label for="exampleInputPassword1" className="form-label">Password</label> */}
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="password" />
                            </div>
                            {/* <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label className="form-check-label" for="exampleCheck1">Check me out</label>
                            </div> */}
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-secondary">Sign In</button>
                            </div>
                            
                        </form>

                    </div>
                    <div id="welcome_register" className="tab-pane fade welcome" role="tabpanel">
                        
                        <form>
                            <div className="mb-3">
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="email" />
                            </div>
                            <div className="mb-3">                                
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="password" />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-secondary">Sign In</button>
                            </div>                        
                        </form>

                    </div>
                </div>
            </div>    





        </div>
    </>
    )
}