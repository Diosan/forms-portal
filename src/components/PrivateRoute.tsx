import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';


// const PrivateRoute = ({ children, ...rest }:any) => {
//     const state = useSelector((state: RootState) => state.auth);
//     const { isLoggedIn, otpRequired, token, isVerified } = state

//   return (
//     <Route
//       {...rest}
//       render={({ location }:any) =>
//         isLoggedIn ? (
//           children
//         ) : (
//           // <Navigate to={{ pathname: '/login', state: { from: location }}} />
//           <Navigate to="/login" state={{ from: location }} replace />

//         )
//       }
//     />
//   );
// };

const PrivateRoute = ({ children }:any) => {
  const state = useSelector((state: RootState) => state.auth);
  const { isLoggedIn, otpRequired, token, isVerified } = state

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
