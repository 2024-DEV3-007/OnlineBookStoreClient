export const EMPTY_FORM_DATA = {
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  };
export const LOGIN="Login";
export const USERNAME = "Username";
export const PASSWORD ="Password";
export const REGISTER ="Register";
export const FIRST_NAME="First Name";
export const LAST_NAME="Last Name";
export const CONFIRM_PASSWORD="Confirm Password";
export const ALREADY_A_USER="Already a user?";
export const NEW_USER="New User";
export const getHostName = () => {return "http://localhost:8080";}
export const API = { register:"/api/register"
};