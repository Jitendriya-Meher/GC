import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const AddProduct = () => {

    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");

    const {axios, fetchProducts} = useAppContext();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

          const productData = {
            name,
            description: description.split("\n"),
            category,
            price,
            offerPrice
          }

          
          const formData = new FormData();
          formData.append('productData', JSON.stringify(productData));
          
          for( let i=0; i<files.length; i++){
            formData.append('images', files[i]);
          }

          const {data} = await axios.post("/api/product/add", formData);

          if( data.success){
            toast.success(data.message);
            setName("");
            setDescription("");
            setCategory("");
            setPrice("");
            setOfferPrice("");
            setFiles([]);
            await fetchProducts();
          }
          else{
            toast.error(data.message);
          }
          
        } catch (error) {
          toast.error(error.message);
        }

    }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form className="md:p-10 p-4 space-y-5 max-w-lg"
      onSubmit={handleSubmit}
      >
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => {
                        const updatedFile = [...files];
                        updatedFile[index] = e.target.files[0];

                        setFiles(updatedFile);
                    }}
                  />
                    <img src={files[index] ? URL.createObjectURL(files[index]): assets.upload_area} alt="" 
                        className="max-w-24 cursor-pointer" 
                    />
                </label>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
            value={name}
            onChange={(e) =>{
                setName(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            value={description}
            onChange={(e) =>{
                setDescription(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={category}
            onChange={(e) =>{
                setCategory(e.target.value);
            }} 
          >
            <option value="">Select Category</option>
            {
                categories.map((item,index) => (
                    <option value={item.path} key={index}>
                        {item.path}
                    </option>
                ))
            }
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
              value={price}
            onChange={(e) =>{
                setPrice(e.target.value);
            }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
              value={offerPrice}
            onChange={(e) =>{
                setOfferPrice(e.target.value);
            }}
            />
          </div>
        </div>
        <button className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary-dull cursor-pointer">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
