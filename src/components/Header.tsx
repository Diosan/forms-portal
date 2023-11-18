
import Button from 'react-bootstrap/Button';

type HeaderProps = {}

export const Header = (({}: HeaderProps) => {
    return (

        <>
            
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">
                    <img src="jswflogo.svg" width="150" className="d-inline-block align-top" alt="" />
                    {/* <div className="site-name">Forms Portal</div> */}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item active jud-header-item">
                            <a className="nav-link" href="/">Home {/* <span className="sr-only">(current)</span> */} </a> 
                        </li>
                        <li className="nav-item jud-header-item">
                            <a className="nav-link" href="/submission">Complaint With Oath</a>
                        </li>
                        {/* <li className="nav-item">
                            <Button>SIGN IN</Button>
                        </li> */}

                        {/* <li className="nav-item">
                            <a className="nav-link disabled" href="#">Disabled</a>
                        </li> */}
                    </ul>
                </div>
            </nav>

        </>

    )
})