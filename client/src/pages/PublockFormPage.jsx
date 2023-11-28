import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import { useContext, useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { max, set } from "date-fns";

export default function PublockFormPage() {

    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [maxCapacity, setMaxCapacity] = useState(300);
    const [price, setPrice] = useState(0.20); //pricing has to be by unit
    const [redirect, setRedirect] = useState(false);

    const {setDeposit, modifyLastAccount, newuser} = useContext(UserContext)

    const [isValidForm, setIsValidForm] = useState(false);

    const ctx = useContext(UserContext);

    const handleModifyLastAccount = () => {
        const users = newuser  // Replace with real user
        const deposits = maxCapacity; // Replace with real deposits
        const withdrawal = 0; // Replace with real withdrawal
        const balance = deposits - withdrawal; // Replace with real balance
        modifyLastAccount(users, deposits, balance, withdrawal);
      };
    

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get('/publocks/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            //startTime and End Time have to be more detailed into hours of operation, delivery promises etc 
            setStartTime(data.startTime);
            setEndTime(data.endTime); 
            //maxCapcity will have to be more detailed by weight class etc 
            setMaxCapacity(data.maxCapacity);
            //pricing will have many more options then this 
            setPrice(data.price);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text) {
        return(
            <p className="text-gray-500 text-sm">{text}</p>

        );
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePublock(ev) {

    
        if(!maxCapacity) {
            alert('Please enter all fields.');
            setIsValidForm(false);
        } else if(parseInt(maxCapacity) < 0) {
            alert('Please enter positive numbers only.');
            setIsValidForm(false);
        } else if (maxCapacity && parseInt(maxCapacity) > 0) {
            setIsValidForm(true);
        } 

        ev.preventDefault();

        if(isValidForm == true) {
            try {
                setDeposit(maxCapacity);
                handleModifyLastAccount();
                alert('Deposit Successful');
                
            } catch (e) {
                alert('Deposit Failed');
            }
        }

        const publockData = {
            title,
            maxCapacity, 
        } 

   

        if(id) {
            //update
            await axios.put('/publocks', {
                id, ...publockData
            });
          
        } else {
            //newPlace
            await axios.post('/publocks', publockData);
        }
      
    }

    return(
    <>
        <form onSubmit={savePublock}>

        <AccountNav />
        
        {preInput('Amount','Amount You Want To Deposit')}
        <input type="number" value={maxCapacity} onChange={ev => setMaxCapacity(ev.target.value)} placeholder="5000"/>

        <div>
            <button className="primary my-4">DEPOSIT</button>
        </div>
    </form>
    </>
    );
}