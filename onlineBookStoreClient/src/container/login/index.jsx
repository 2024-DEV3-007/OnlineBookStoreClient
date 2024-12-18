import React, { useState } from "react";
import {EMPTY_FORM_DATA,LOGIN,USERNAME,PASSWORD,REGISTER,FIRST_NAME,LAST_NAME,CONFIRM_PASSWORD,ALREADY_A_USER,NEW_USER,getHostName,API} from "../../utils/constants";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

const Login = () => {
const navigate = useNavigate();
const [formData,setFormData] = useState(EMPTY_FORM_DATA);
const [isNewUser, setIsNewUser] = useState(false);
const [isPasswordMatch, setIsPasswordMatch] = useState(false);
const [hasTypedConfirmPassword, setHasTypedConfirmPassword] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const updateFormData = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
if(e.target.name === "confirmPassword" || e.target.name === "password")
    handlePasswordConfirmationIcon(e.target.name,e.target.value)
  };

const handlePasswordConfirmationIcon =(targetName,value) => {
    if(value!=''){
        targetName === "confirmPassword" ? handleConfirmPasswordChange(value) : handlePasswordChange(value)
    }
};

const handleConfirmPasswordChange = (value) => {
    formData.password ? setHasTypedConfirmPassword(true) : etHasTypedConfirmPassword(false)
    setIsPasswordMatch(formData.password === value);
};

const handlePasswordChange = (value) => {
    formData.confirmPassword ? setHasTypedConfirmPassword(true) : setHasTypedConfirmPassword(false);
    setIsPasswordMatch(value === formData.confirmPassword);
};


const toggleNewUser = () => {
  setIsNewUser(!isNewUser);
  setFormData(EMPTY_FORM_DATA);
  setErrorMessage("");
  };

  const isLoginFormInvalid = () => {
    return isFieldEmptyInLoginForm();
  };

  const isFieldEmptyInLoginForm=() => {
    return !formData.username || !formData.password;
  }

  const isRegisterFormInvalid = () => {
    return isFieldEmptyInRegisterForm() || isPasswordMismatch();
  };

  const isPasswordMismatch = () =>{
    return formData.password !== formData.confirmPassword;
  }

  const isFieldEmptyInRegisterForm=() => {
    return !formData.username || !formData.password || !formData.firstName || !formData.lastName || !formData.confirmPassword
  }

const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleError = (error) => {
    setSuccessMessage("");
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred. Please try again later.";
    setErrorMessage(errorMessage);
    setFormData(EMPTY_FORM_DATA);
  };

const handleRegister = async () => {
    try {
      const response = await axios.post(getHostName()+API.register, {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      });
      const responseData = response.data;
      responseData.validResponse ? handleSuccess(responseData.message) : setErrorMessage(responseData.message);
    } catch (error) {
         handleError(error);
    }
  };

const handleLogin = async () => {

    try {
      const response = await axios.post(getHostName()+API.login, {
        username: formData.username,
        password: formData.password,
      });

      const responseData = response.data;

      if (responseData.validResponse) {
        setSuccessMessage(responseData.message);
        setErrorMessage("");

        navigate("/books", {
          state: {
            username: formData.username,
            password: formData.password,
          },
        });
      } else {
        setSuccessMessage("");
        setErrorMessage(responseData.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

 return (
    <div className="login-container">
      <div className="login-form">
        <h1 data-testid="login-heading">{isNewUser ? REGISTER : LOGIN}</h1>
        {successMessage && <div className="success-message" data-testid="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message" data-testid="error-message">{errorMessage}</div>}
        <span className="info-message">(Please fill all the details)</span>
         <div className="form-group">
            <input type="text" name="username" placeholder={USERNAME} value={formData.username}
                    onChange={updateFormData} />
            {isNewUser && (
              <>
                <input type="text" name="firstName" placeholder={FIRST_NAME} value={formData.firstName}
                                       onChange={updateFormData} />
                <input type="text" name="lastName" placeholder={LAST_NAME} value={formData.lastName}
                                      onChange={updateFormData} />
              </>)}
            <input type="password" name="password" placeholder={PASSWORD} value={formData.password}
                    onChange={updateFormData} />
         {isNewUser  && ( <div className="form-group confirm-password-container">
                <input type="password" name="confirmPassword" placeholder={CONFIRM_PASSWORD} value={formData.confirmPassword}
                          onChange={updateFormData}/>
                {hasTypedConfirmPassword && (
                                <div className="password-validation-icon">
                                  {isPasswordMatch ? (
                                    <FaCheck data-testid="password-match" style={{ color: "green" }} />
                                  ) : (
                                    <FaTimes data-testid="password-notmatch"style={{ color: "red" }} />
                                  )}
                                </div>
                )}
               </div>
         )}
        <button className="form-button" data-testid="login-id"
            disabled={isNewUser?isRegisterFormInvalid():isLoginFormInvalid()} onClick={isNewUser ? handleRegister : handleLogin}>
            {isNewUser ? REGISTER : LOGIN}
        </button>
        <button className={"form-button already-user"} data-testid="toggle-user-type"
          onClick={toggleNewUser} >
          {isNewUser ? ALREADY_A_USER : NEW_USER}
        </button>
         </div>

      </div>
    </div>
 );
};


export default Login;