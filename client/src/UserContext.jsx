import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {data} from "autoprefixer"

//const {data} = 
//setUser(data);

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [newuser, setNewUser] = useState(null);

    const [deposit, setDeposit] = useState(null);
    const [withdraw, setWithdraw] = useState(null);
    const [balance, setBalance] = useState(null);

    const [accounts, setAccounts] = useState([]);

    // Function to add an account
    const addAccount = (users, deposits, balance, withdrawal) => {
      setAccounts(accounts => [
        ...accounts,
        { users, deposits, balance, withdrawal},
      ]);
    };

    // Function to update an account
    const modifyLastAccount = (users, deposits, balance, withdrawal) => {
        setAccounts(accounts => {
        const newAccounts = [...accounts]; // Copy the array
        const lastAccountIndex = newAccounts.length - 1;

      if (lastAccountIndex >= 0) { // Check if there are any accounts
        newAccounts[lastAccountIndex] = {users, deposits, balance, withdrawal };
      }

      return newAccounts;
    });
  };

    useEffect(() => {
        if(!user) {
            axios.get('/profile').then(({data})=> {
                setUser(data);
                setReady(true);
            });    
        }
      }, []);
    return(
        <UserContext.Provider value={{newuser, setNewUser, user,setUser,ready,setDeposit, deposit, withdraw, setWithdraw, accounts, addAccount, modifyLastAccount}}>
            {children}
        </UserContext.Provider>
    );
}

