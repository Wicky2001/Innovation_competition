import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticateObject, setAuthenticationObject] = useState(null);
  const [register, setRegister] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  

  const registerAction = (data) => {
    axios.post("http://localhost:5001/register", data)
      .then((response) => {
        console.log("Register request response = ", response.data);
        setAuthenticationObject(response.data);
        console.log("Authenticate is", response.data.authenticate);
        if (response.data.authenticate) {
          navigate('/chat');
        } else {
          setTimeout(() => {
            setRegister(false);
            setMessage("");
          }, 1500);
          setMessage(response.data.statusMessage);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loginAction = (data) => {
    axios.post("http://localhost:5001/login", data)
      .then((response) => {
        console.log("Login request response = ", response.data);
        setAuthenticationObject(response.data);
        console.log("Authenticate is", response.data.authenticate);
        if (response.data.authenticate) {
          navigate('/chat');
        } else {
          setMessage(response.data.statusMessage);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isAuthenticatedAction = async () => {
    return axios.get("http://localhost:5001/isAuthenticated")
      .then((response) => {
       
        setAuthenticationObject(response.data);
        console.log("Authenticate is in isAuthenticated", response.data.authenticate);
        return response.data.authenticate;
      })
      .catch((error) => {
        console.error("Error in axios call:", error);
        return false; 
      });
  };
  

  return (
    <AuthContext.Provider value={{ authenticateObject, registerAction, loginAction, isAuthenticatedAction, message, register, setRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
