import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { set } from "date-fns";

export default function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isValidForm, setIsValidForm] = useState(false);


    const { addAccount, setNewUser } = useContext(UserContext)

    const handleAddAccount = () => {
      const users = name; // Replace with real user
      const balance = 0; // Replace with real balance
      const withdrawal = 0; 
      const deposits = 0// Replace with real withdrawal
  
      addAccount(users, deposits, balance, withdrawal);
    };
  
    async function registerUser(ev){


        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            setIsValidForm(false);
        } else if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            setIsValidForm(false);
        } else if (name && email && password && password.length >= 8) {
            setIsValidForm(true);
        }
        
        ev.preventDefault();  
        if(isValidForm == true){

            try {
                setNewUser(name);
                handleAddAccount();
                alert('Account Created');
                
                
            } catch (e) {
                alert('Login Failed');
            }

        }
              
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Publock Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Gavin Belson" 
                         value={name}
                         onChange={ev => setName(ev.target.value)}/>
                    <input type="email" placeholder={'your@email.com'}
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}/>           
                    <input type="password" placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}/>
                    <button className="primary">Register</button>
                <div className="text-center py-2 text-gray-500">
                    Already A Member? <Link className= "underline text-pink-400" to={'/login'}>Login </Link>
                </div>
            </form>
            </div>
        </div>
    );
}