import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Myorders = () => {

  const [myOrders, setMyOrders] = useState([]);
  const {currency,axios, user} = useAppContext();

  const fetchMyOrders = async () => {

    try {

      const {data} = await axios.get("/api/order/user");

      if( data.success){
        setMyOrders(data.orders);
      }
      else{
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }

  }

  const deleteOrder = async (id) => {

    try {

      const {data} = await axios.post("/api/order/delete",{
        id: id
      });

      if( data.success){
        toast.success(data.message);
        await fetchMyOrders();
      }
      else{
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }

  }

  useEffect(() => {

     if( user){
      fetchMyOrders();
     }

  },[user]);
 
  return (
    <div className=' mt-16 pb-16'>

      <div className=" flex flex-col items-end w-max mb-8">

          <p className=" text-2xl font-medium uppercase">
            <span className=' text-primary'>my</span> Orders
          </p>
          <div className=" w-16 h-0.5 bg-primary rounded-full"></div>

      </div>

      {
        myOrders.map((order, index) => (
          <div className=" border border-gray-300 rounded-lg mb-10 py-5 p-4 max-w-4xl flex gap-8 item-center" key={index}>

            <div className="">
              <p className=' flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>

              <span>OrderId : {order._id}</span>

              <span>Payment : {order.paymentType}</span>

              <span>Total Amount : {currency} {order.amount}</span>

            </p>

            {
              order.items.map((item,index) => (
                <div className={`relative bg-white text-gray-500/70  ${order.items.length !== index+1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`} key={index}>

                <div className=" flex items-center mb-4 md:mb-0">

                  <div className=" bg-primary/10 p-4 rounded-lg">

                    <img src={item.product.image[0]} className=' w-16 h-16' alt="" />

                  </div>
                  <div className=" ml-4">
                    <h2 className=' text-xl font-medium text-gray-800'>
                      {item.product.name}
                    </h2>
                    <p className=' text-gray-400'>
                      Category: {item.product.category}
                    </p>
                  </div>

                </div>

                <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                  <p>
                    Quantity: {item.quantity || "1"}
                  </p>
                  <p>
                    Status: {order.status}
                  </p>
                  <p>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className=' text-primary text-lg font-medium'>
                  Amount: {currency}{item.product.offerPrice * item.quantity}
                </p>

                </div>
              ))
            }
            </div>

            <div className=" flex items-start pl-4 pt-4 flex-col gap-4">
              {order.status !== "Delivered" ? <p className=' bg-red-200 px-3 py-2 rounded-full border border-red-600 cursor-pointer'
              onClick={() => {
                deleteOrder(order._id);
              }}
              >
                Cancel Order
              </p> :
              <p className=' bg-green-200 px-3 py-2 rounded-full border border-green-600 cursor-pointer'
              >
                Order Delivered
              </p>}
              <p className=' px-3 py-2 border border-gray-400 w-full text-center rounded-md'>
                {order.status}
              </p>
            </div>

          </div>
        ))
      }

    </div>
  )
}

export default Myorders