import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
    const { axios, currency } = useAppContext();

    const [data, setData] = useState({
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
        confirmOrder: 0,
        recentOrders: [],
        monthlyRevenue: 0,
    });

    const dashboardCards = [
        {
            title: "Total Products",
            value: data.totalProducts,
            icon: assets.cart_icon,
        },
        {
            title: "Total Orders",
            value: data.totalOrders,
            icon: assets.leaf_icon,
        },
        {
            title: "Pending Orders",
            value: data.pendingOrders,
            icon: assets.product_list_icon,
        },
        {
            title: "Confirm Orders",
            value: data.confirmOrder,
            icon: assets.order_icon,
        },
    ];

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get("/api/user/dashboard");

            console.log("dashboardCards", data);

            if (data.success) {
                setData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className=" px-4 pt-10 md:px-10 flex-1">
            <h1>Dashbord</h1>

            <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
                {dashboardCards.map((card, index) => (
                    <div
                        key={index}
                        className=" flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
                    >
                        <div className="">
                            <h1 className=" text-xs text-gray-500">{card.title}</h1>

                            <p className=" text-lg font-semibold">{card.value}</p>
                        </div>

                        <div className=" flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <img src={card.icon} className="h-5 w-5" alt="" />
                        </div>
                    </div>
                ))}
            </div>

            <div className=" flex flex-wrap items-start gap-6 mb-8 w-full">
                <div className=" p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
                    <h1 className=" text-lg font-medium">Recent Orders</h1>

                    <p className=" text-gray-500">Latest</p>

                    <div className=" flex flex-col gap-2">
                        {data.recentOrders.map((order, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row gap-5 justify-between md:items-start p-5 rounded-md border border-gray-300"
                            >
                                <div className="flex gap-5 max-w-80">
                                    <img
                                        className="w-12 h-12 object-cover"
                                        src={assets.box_icon}
                                        alt="boxIcon"
                                    />
                                    <div className=" flex flex-col gap-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex flex-col justify-center">
                                                <p className="font-medium">
                                                    {item.product.name}
                                                    <span className=" text-primary">
                                                        {"  "} x {item.quantity}
                                                    </span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <p className="font-medium text-base my-auto text-black/70">
                                    {currency}
                                    {order.amount}
                                </p>
                                <p className=" flex items-center justify-center border border-gray-300 px-2 py-1.5 rounded-md">
                                    {order.status}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className=" p-4 md:p-6 border border-borderColor rounded-md w-full md:max-w-xs">
                    <h1 className=" text-lg font-medium">Monthly Revenue</h1>
                    <p className=" text-gray-500">Revenue for current month</p>
                    <p className=" text-3xl mt-6 font-semibold text-primary">
                        {currency} {data.monthlyRevenue}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
