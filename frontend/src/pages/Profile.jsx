import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {

  const { user, axios, setUser} = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (e) => {

        e.preventDefault();

        try {

            const {data} = await axios.post("/api/user/update",{
                name,
                email
            });

            if( data.success){
                toast.success(data.message);
                setUser({
                    name,
                    email
                })
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }

    const submitHandler2 = async (e) => {

        e.preventDefault();

        try {

            if( newPassword != confirmPassword){
                return toast.error("password and confirm password doesn't matches");
            }

            const {data} = await axios.post("/api/user/change-password",{
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            if( data.success){
                toast.success(data.message);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }


  useState(() => {

    if( user){
      setName(user.name);
      setEmail(user.email);
    }

  },[user]);

  return (
    <div className=" min-h-[70vh] flex gap-12 flex-wrap p-4 items-start">

      <form
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={submitHandler}
      >

       <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Change</span>{" "}
          Profile
        </p>

        <div className="w-full ">
          <p>Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="text"
            required
          />
        </div>

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Change Profile
        </button>
      </form>

      <form
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={submitHandler2}
      >

       <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Change</span>{" "}
            Password
        </p>

        <div className="w-full ">
          <p>Old Password</p>
          <input
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        <div className="w-full ">
          <p>New Password</p>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        <div className="w-full ">
          <p>Condirm New Password</p>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Change Password
        </button>
      </form>

    </div>
  )
}

export default Profile