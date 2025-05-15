import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import st from "@/styles/adminForms.module.css";
import { ToastContainer, toast } from "react-toastify";


export default function AddProductForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  // taost 
  const suToast = (text) => {
    toast.success(text, {
      draggable: true,
      style: {
        backgroundColor: "#415074",
        color: "white",
        fontFamily: "B Nazanin, Arial, sans-serif",
        boxShadow: "-2px 2px 4px 1px rgba(0, 0, 0, 0.2)",
      },
    });
  };
  const erToast = (text) => {
    toast.error(text, {
      draggable: true,
      style: {
        backgroundColor: "#415074",
        color: "white",
        fontFamily: "B Nazanin, Arial, sans-serif",
        boxShadow: "-2px 2px 4px 1px rgba(0, 0, 0, 0.2)", 
      },
    });
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  // Data preview setting
  const [fData, setFData] = useState({});
  const onChange = (e) => {
    const formValues = getValues();
    setFData(formValues);
  };
  // Image preview handler
  const [selectedImage, setSelectedImage] = useState(null);
  const [fImage, setFImage] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      setFImage(file);
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submitting to add ne Product
  const onSubmit = (data) => {
    // Data setup
    try {
      const encodedPrices = data.prices.toString();
      const encodedWeights = data.weights.toString();
      const weightsArray = data.weights.split("-");
      const pricesArray = JSON.parse("[" + encodedPrices + "]");
      const explanationArray = data.explanation.split("-");
      const categoryArray = data.category.split("-");
      data.weights = weightsArray;
      data.prices = pricesArray;
      data.explanation = explanationArray;
      data.category = categoryArray;
      // prepare data to send

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("available", data.available);
      formData.append("offer", data.offer);
      formData.append("picture", fImage);
      formData.append("weights", JSON.stringify(weightsArray));
      formData.append("prices", JSON.stringify(pricesArray));
      formData.append("category", JSON.stringify(categoryArray));
      formData.append("explanation", JSON.stringify(explanationArray));


      // Sending data to server

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`, {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          const result = await res.text();
          if (await res.ok) {
            suToast(result);
          } else {
            erToast(result);
          }
        })
        .catch((err) => {
          erToast("Data not sent correctly!");
        })
    } catch (error) {
      erToast("data format is not correct!");
    }
  };

  return (
    <div className={st.thisClass}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} onChange={onChange}>
        <input
          id="name"
          placeholder="Product name"
          {...register("name", { required: "Please fill this part" })}
        />
        {errors.name && <p>{errors.name.message}</p>}

        <input
          type="text"
          placeholder="Add weight...( 250 - 500 - 1000 )"
          {...register("weights", { required: "Please fill this part" })}
        />
        {errors.weights && <p>{errors.weights.message}</p>}

        <input
          type="text"
          placeholder="Add Prices...( 190000,300000,650000 )"
          {...register("prices", { required: "Please fill this part" })}
        />
        {errors.prices && <p>{errors.prices.message}</p>}

        <input
          type="number"
          placeholder="offer"
          {...register("offer", { required: "Please fill this part" })}
        />
        {errors.offer && <p>{errors.offer.message}</p>}

        <textarea
          placeholder="Add Explanation ...( exp : detail - exp : detail)"
          {...register("explanation", { required: "Please fill this part" })}
        />
        {errors.explanation && <p>{errors.explanation.message}</p>}

        <input
          type="text"
          placeholder="Add Category ... ( category - category )"
          {...register("category", { required: "Please fill this part" })}
        />
        {errors.category && <p>{errors.category.message}</p>}

        <select
          {...register("available", { required: "Availability is required" })}
        >
          <option value={true}>Available</option>
          <option value={false}>Unavailable</option>
        </select>
        {errors.available && <p>{errors.available.message}</p>}
        <input
          type="file"
          accept="image/*"
          {...register("picture", { required: "Please upload a picture" })}
          onChange={handleImageChange}
        />
        {errors.picture && <p>{errors.picture.message}</p>}
        <button type="submit">Submit</button>
      </form>
      <fieldset>
        <p>Name : {fData.name}</p>
        <p>Weights : {fData.weights}</p>
        <p>Prices : {fData.prices}</p>
        <p>Offer : {fData.offer}</p>
        <p>Explanation : {fData.explanation}</p>
        <p>Category : {fData.category}</p>
        <p>Available : {fData.available}</p>
        {selectedImage ? (
          <Image src={selectedImage} width={200} height={200} />
        ) : null}
      </fieldset>
      <ToastContainer />
    </div>
  );
}
