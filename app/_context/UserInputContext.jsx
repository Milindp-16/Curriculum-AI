import { createContext } from "react";


/*
this global context provider prevents prop drilling and passes the user inputs to each and every child present inside 
context provider wrapper. in order to use the context just use useContext()
*/
export const UserInputContext = createContext();