import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
//import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import axios from "axios";
import { Arrow, Eth } from "@web3uikit/icons";
import { useConnect, useAccount} from "wagmi";
import {MetaMaskConnector} from "wagmi/connectors/metaMask";

export default function IndexPage() {

    //Very Similiar to how we are getting publocks from our database we can do it from blockchain 
    //We may be able to use moralis instead as well for some reason Axios keeps crashing 
    const [publocks,setPublocks] = useState([]);
    useEffect(() => {
        axios.get('/publocks').then(response => {
            setPublocks(response.data);
        });
    }, []);

    const [isToggled, setToggle] = useState(false); // initial state is 'false'
    const { address, isConnected } = useAccount();
      
    const handleToggle = () => {
        setToggle(!isToggled); // switches the state to the opposite value
    };

    const { connect } = useConnect({
        connector: new MetaMaskConnector(),
    });

    return (
        <>
        <br></br>
        <br></br>
        <div className="-mt-7 -mx-8 px-8 pt-8">
        <section className="main">

        <section className="heroSection">
          <h1 className="bayc_data__title ">WELCOME TO PUBLOCK THE FUTURE OF BANKING!</h1>
          {isConnected? 
            <section className="bayc_data">
    
            <Link to={"/account/publocks/new"}>
              <button className="viewCollection_btn">
                DEPOSIT
              </button>
            </Link>
            <Link to={'/createstore/new'} className="flex rounded-full px-1">
              <button className="viewCollection_btn">
                WITHDRAW
              </button>
            </Link>
            <Link to={'/createstore/new'} className="flex rounded-full px-1">
              <button className="viewCollection_btn">
                DOCS
              </button>
            </Link>
              <Arrow fontSize="20px" className="arrow"/>
            </section>
            :

            <section className="bayc_data"> 
                <button className="viewCollection_btn" onClick={connect}>
                    CONNECT WALLET
                </button>   
            </section>
        } 
          
        </section>
        </section>
        </div>
        </>             
    );
}