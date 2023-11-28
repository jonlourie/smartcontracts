import PhotosUploader from "../PhotosUploader";
import StoreTraits from "../StoreTraits";
import { useContext, useEffect, useState } from "react";
import UserNav from "../UserNav";
import { Navigate, useParams } from "react-router-dom";
import TagCreator from "../components/TagCreator";
import axios from "axios";
import AccountNav from "../AccountNav";
import { UserContext } from "../UserContext";
import { de } from "date-fns/locale";

export default function CreateStore() {

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
    const [nftAddress, setNFTAddress] = useState('');
    const [nftId, setNftId] = useState('');
    const [tagNumber, setTagNumber] = useState([]);

    const [isToggled, setToggle] = useState(false); // initial state is 'false'

    const [isValidForm, setIsValidForm] = useState(false);

    const {setWithdraw, modifyLastAccount, deposit, newuser} = useContext(UserContext)

    const handleModifyLastAccount = () => {
      const users = newuser; // Replace with real user 
      const deposits = deposit; // Replace with real deposits
      const withdrawal = price; // Replace with real withdrawal
      const balance = deposit - price; // Replace with real balance
  
      modifyLastAccount(users, deposits, balance, withdrawal);
    };

    const handleToggle = () => {
      setToggle(!isToggled); // switches the state to the opposite value
    };
  
    useEffect(() => {
        if(!id) {
            return;
        }

        //this will be a smart contract or a query that we call in the dashbaord so they can edit or change things
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    function generateTag(ev) {

    }

    async function savePublock(ev) {

        if (!price) {
            alert('Please fill in all fields.');
            setIsValidForm(false);
        } else if (price > deposit) {
            alert('not enough in account');
            setIsValidForm(false);
        } else if (price && price < deposit) {
            setIsValidForm(true);
        }

        ev.preventDefault();

        const publockData = {
            title,
            price,
        } 

        if(isValidForm == true){
            try {
                setWithdraw(price);
                handleModifyLastAccount();
                alert('success');
            } catch (e) {
                alert('Login Failed');
            }
        }

        if(id) {
            //update
            await axios.put('/publocks', {
                id, ...publockData
            });
            setRedirect(true);
        } else {
            //newPlace
            await axios.post('/publocks', publockData);
            setRedirect(true);
        }
      
    }

    if(redirect) {
        return <Navigate to={'/account/publocks'} />
    }

    return(
    <>
        <form onSubmit={savePublock}>
        <AccountNav />
        
        {preInput('Amount','how much will you take out?')}
        <input type="number" value={price} onChange={ev => setPrice(ev.target.value)} placeholder="5000"/>
        
        <br></br>

        <div>
            <button className="primary my-4">WITHDRAW</button>
        </div>
    </form>
 </>
    );
}