import { useState } from "react";
import st from "@/styles/adminForms.module.css";
import { ToastContainer, toast } from "react-toastify";


export default function DeleteProduct(props) {
  const [isLoading, setIsLoading] = useState(true);
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
  const onSubmit = (event) => {
    event.preventDefault();
    const formId = event.target[0].value;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: formId,
      }),
    })
      .then( async (res) => {
        if (res.status == 200) {
          return await res.text();
        } else {
          throw new Error(
            `${ await res.text()}`
          );
        }
      })
      .then((data) => {
        suToast(data);
        console.log('meow');
      })
      .catch((err) => {
        erToast(err.message || "Error deleting data");
      });
    }
  return (
    <div className={st.thisClass}>
      <h2>Delete Product</h2>

      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Enter Product ID " />
        <button type="submit">Delete</button>
      </form>
      <ToastContainer />
    </div>
  );
}
