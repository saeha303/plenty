import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar/Navbar';
import '../Context/OneAuction.css';
import Product from '../Components/Product/Product';
import CountdownTimer from '../Components/CountdownTimer/CountdownTimer';
import AuctionProduct from '../Components/AuctionProduct/AuctionProduct';
import BidPopup from '../Components/BidPopup/BidPopup';

const OneAuction = () => {
  const {userId,auctionId}=useParams();

  const [auction,setAuction]=useState({});
  const [products,setProducts]=useState([]);
  const [topProducts,setTopProducts]=useState([]);
  const [date, setDate] = useState("");
  const [start,setStart] = useState(new Date());
  const [end,setEnd] = useState(new Date());
  const [remainingTime,setRtime]=useState(2100);
  const [isOver,setIsOver]=useState(false);
  
  useEffect(() => {
    const fetchTime = async ()=>{
      try {
        const response = await fetch(`https://plenty-ten.vercel.app/api/auction/${auctionId}/remainingTime`);
        const data = await response.json();
        setRtime(Number(Number(data.hour)*3600+Number(data.min)*60+Number(data.sec)));
        console.log(Number(Number(data.hour)*3600+Number(data.min)*60+Number(data.sec)));
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
     }
     fetchTime();

  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
        try {
            const response = await fetch(`https://plenty-ten.vercel.app/api/auction/get-auction/${auctionId}`);
            const data = await response.json();
            setAuction(data);
            setDate(data.date.substring(0, 10));
            setStart(new Date(data.startTime));
            setEnd(new Date(data.endTime));
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      };

      const fetchProducts = async ()=>{
        try {
          const response = await fetch(`https://plenty-ten.vercel.app/api/auction/${auctionId}/products`);
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
       }

       const fetchTopProducts = async ()=>{
        try {
          const response = await fetch(`https://plenty-ten.vercel.app/api/auction/${auctionId}/top`);
          const data = await response.json();
          setTopProducts(data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
       }

       const checkTimeEnd = ()=>{
        if(remainingTime<=0)
          setIsOver(true);
       }

      
     const intervalId = setInterval(() => {
      fetchOrder();
      fetchProducts();
      fetchTopProducts();
      setRtime((prevTime) =>{
        if(prevTime>0) return prevTime-1;
        else {setIsOver(true); return 0;}
      });
      // checkTimeEnd();
      
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, []);

  const handleTimerEnd = () => {
    console.log('Timer ended!'); // You can perform any action when the timer reaches 0
  };

  const formatTime = () => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const padZero = (value) => (value < 10 ? `0${value}` : value);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  };
 
  return (
    <div>
      <Navbar userId={userId}/>
      <div className="oneauction-headers">
          <div className="oneauction-dateTime">
            <p><b>Date: {date}</b></p>
            <p><b>Start time: {start.getHours().toString().padStart(2, '0')}:{start.getMinutes().toString().padStart(2, '0')}:{start.getSeconds().toString().padStart(2, '0')}</b></p>
          </div>
          {!isOver &&( <div className="oneauction-timeremaining">
            <p style={{fontSize:'22px'}}><b>Time remaining: {formatTime()}</b></p>
          </div>)}
          
          {isOver &&( <div className="oneauction-timeremaining">
            <p style={{color:"rgb(141, 16, 187)"}}>Auction Ended!</p>
            <Link to={`/auction/payProducts/${userId}/${auctionId}`}><button>Pay for your products</button></Link>
          </div>)}
         
          <div className="oneauction-totalsold">
          <p><b>End time: {end.getHours().toString().padStart(2, '0')}:{end.getMinutes().toString().padStart(2, '0')}:{end.getSeconds().toString().padStart(2, '0')}</b></p>
          </div>  
      </div>


      <div className='trending'>
      <h1>Highest bid products</h1>
      <div className= 'tr-products'>
        {topProducts.map((item,i)=>{
             return <AuctionProduct label='product'key={i} id={item._id} userId={userId} auctionId={auctionId} name={item.name} description={item.description} photo={item.photo} highestBidder={item.highestBidder} currentBid={item.currentBid}/>
        })}
      </div>
      </div>

      <div className='trending'>
      <h1>All Products</h1>
      <div className= 'tr-products'>
        {products.map((item,i)=>{
             return <AuctionProduct label='product'key={i} id={item._id} userId={userId} auctionId={auctionId} name={item.name} description={item.description} photo={item.photo} highestBidder={item.highestBidder} currentBid={item.currentBid}/>
        })}
      </div>
      </div>
    </div>
  )
}

export default OneAuction
