import st from "@/styles/adminForms.module.css";
import { useForm, reset } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

export default function EditProductPop(props) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  // Item data entering controll
  const formref = useRef(null);
  useEffect(() => {
    console.log(formref.current);
    const myForm = formref.current;
    if (props.data) {
      myForm[0].value = props.data.name;
      myForm[1].value = props.data.weights;
      myForm[2].value = props.data.prices;
      myForm[3].value = props.data.offer;
      myForm[4].value = props.data.explanation;
      myForm[5].value = props.data.category;
    }
  }, [props.data]);

  // Data preview setting
  const [fData, setFData] = useState({});
  const onChange = (e) => {
    const formValues = getValues();
    setFData(formValues);
  };
  useEffect(() => {
    const formValues = getValues();
    setFData(formValues);
  }, [props.data]);

  // Submitting to update Product
  const onSubmit = (data) => {
    // Data setup
    try {
      const encodedPrices = data.prices.toString();
      const weightsArray = data.weights.split("-");
      const pricesArray = JSON.parse("[" + encodedPrices + "]");
      const explanationArray = data.explanation.split("-");
      const categoryArray = data.category.split("-");
      data.weights = weightsArray;
      data.prices = pricesArray;
      data.explanation = explanationArray;
      data.category = categoryArray;
      data._id = props.data._id;
      // prepare data to send

      const formData = new FormData();
      formData.append("_id", props.data._id);
      formData.append("name", data.name);
      formData.append("available", data.available);
      formData.append("offer", data.offer);
      formData.append("picture", props.data.picture && props.data.picture);
      formData.append("weights", JSON.stringify(weightsArray));
      formData.append("prices", JSON.stringify(pricesArray));
      formData.append("category", JSON.stringify(categoryArray));
      formData.append("explanation", JSON.stringify(explanationArray));


      // Sending data to server

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          const result = await res.text();
          if (await res.ok) {
            toast.success(result);
            reset();
          } else {
            toast.error(result);
          }
        })
        .catch((err) => {
          toast.error("Data not sent correctly!");
        })
        .finally(() => {
        });
    } catch (error) {
      toast.error("data format is not correct!");
    }
  };
  return (
    <div className={st.popBack} style={props.display}>
      <div className={st.prBack} onClick={props.hide}></div>
      <div className={st.prPop}>
        <h3>
          ID : {props.data && props.data._id} &nbsp;&nbsp; Version :{" "}
          {props.data && props.data.__v}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={onChange}
          ref={formref}
        >
          <input
            id="name"
            placeholder="Product name"
            {...register("name", { required: "Please fill this part" })}
          />
          {errors.name && <p>{errors.name.message}</p>}

          <input
            type="text"
            placeholder="Add weight...( 250 , 500 , 1000 )"
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
          {props.data ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${props.data.picture}`}
              width={200}
              height={200}
            />
          ) : null}
        </fieldset>
      </div>
      <ToastContainer />
    </div>
  );
}
