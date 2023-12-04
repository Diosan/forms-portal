// import jwtDecode, { JwtPayload } from 'jwt-decode'
import { jwtDecode, JwtPayload } from 'jwt-decode'

export default class AuthService {

    setToken = (token: any) => {
      localStorage.setItem('id_token', token)
      localStorage.setItem('userToken', token)
    }

    getToken = () => {
        return localStorage.getItem("id_token") || localStorage.getItem('userToken')
    }

    isTokenExpired = (token: any) => {
        try {
          const decoded: any = jwtDecode<JwtPayload>(token)
          // console.log('Decoded JWT Token: ', decoded)
          if (decoded.exp < Date.now() / 1000) {
            // Checking if token is expired.
            return true;
          } else return false;
        } catch (err) {
          console.log("expired check failed!")
          return false;
        }
    };

    loggedIn = () => {
        const token = this.getToken()
        return !!token && !this.isTokenExpired(token)
    }

    decodedToken = async () => {
      let token: any = await localStorage.getItem("id_token")
      const decoded: any = jwtDecode<JwtPayload>(token)
      // console.log('Decoded Token: ', decoded)
      return decoded
    }

    login = () => {

    }

    

}