import React, { useState } from "react";
import {EMPTY_FORM_DATA,LOGIN,USERNAME,PASSWORD,REGISTER,FIRST_NAME,LAST_NAME,CONFIRM_PASSWORD,ALREADY_A_USER,NEW_USER} from "../../utils/constants";
import "./index.css";

const Login = () => {
const [formData,setFormData] = useState(EMPTY_FORM_DATA);
const [isNewUser, setIsNewUser] = useState(false);


const updateFormData = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const toggleNewUser = (e) => {
  setIsNewUser(!isNewUser);
  setFormData(EMPTY_FORM_DATA);
  };

 return (
    <div className="login-container">
      <div className="login-form">
        <h1 data-testid="login-heading">{isNewUser ? REGISTER : LOGIN}</h1>
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
         {isNewUser && (
                <input type="password" name="confirmPassword" placeholder={CONFIRM_PASSWORD} value={formData.confirmPassword}
                          onChange={updateFormData}/>
         )}
        <button className="form-button" data-testid="login-id" onClick={()=>{}} >
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