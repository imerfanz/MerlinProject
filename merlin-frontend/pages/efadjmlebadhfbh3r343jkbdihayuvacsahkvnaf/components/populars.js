import st from "@/styles/adminForms.module.css";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";

export default function Populars(props) {
  // Initial popular fetch
  const [populars, setPopulars] = useState([]);
  const [products, setProducts] = useState([]);

  const getPopulars = async () => {
    const backResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/populars`
    );
    if (backResponse.ok) {
      const responseJson = await backResponse.json();
      setPopulars(responseJson);
    } else {
      toast.error("Fetch failed");
    }
  };

  // Add this function to fetch product details
  const getProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${productId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        // Double check again before setting state to prevent race conditions
        setProducts(prevProducts => {
          if (prevProducts.some(p => p._id === data._id)) {
            return prevProducts; // Return existing state if duplicate found
          }
          return [...prevProducts, data];
        });
      } else {
        console.error("Product fetch failed:", response.status);
      }
    } catch (error) {
      toast.error("Error fetching product details");
    }
  };

  useEffect(() => {
    getPopulars();
  }, []);

  useEffect(() => {
    if (populars.length > 0) {
      populars.forEach((popular) => {
        getProductDetails(popular.popId);
      });
    }
  }, [populars]);

  // Add popular item
  const addItem = async (e) => {
    e.preventDefault();
    const item = {
      id: e.target[0].value,
      slideNumber: e.target[1].value,
      action: "add",
    };
    try {
      const backResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=popularControll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );
      const responseText = await backResponse.text();
      console.log(backResponse);

      if (backResponse.ok) {
        toast.success(responseText);
      } else {
        toast.error(responseText);
      }
    } catch (error) {
      toast.error("Fetch failed");
    }
  };

  // The function to delete the popular item
  const deleteItem = async (id) => {
    const item = {
      id: id,
      action: "delete",
    };

    try {
      const backResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=popularControll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );
      const responseText = await backResponse.text();
      console.log(backResponse);

      if (backResponse.ok) {
        toast.success(responseText);
      } else {
        toast.error(responseText);
      }
    } catch (error) {
      toast.error("Fetch failed");
    }
  };

  return (
    <div className={st.thisClass}>
      <h2>Populars</h2>
      <form onSubmit={addItem}>
        <input type="text" placeholder="popular item's ID ..." required />
        <input
          type="number"
          min={"1"}
          placeholder="Slide number ..."
          required
        />
        <button type="submit" style={{ width: "150px" }}>
          Add +
        </button>
      </form>
      <table
        style={{
          width: "70%",
          margin: "auto",
          borderCollapse: "collapse",
          tableLayout: "fixed", // This helps control column widths

        }}
      >
        <thead>
          <tr>
            <th style={{ width: "5%" }}></th>
            <th style={{ width: "50%" }}>Name</th>
            <th style={{ width: "25%" }}>Slide Number</th>
            <th style={{ width: "20%" }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((popular, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{popular.name}</td>
              <td>
                {populars.find((pop) => pop.popId === popular._id)?.slideNumber}
              </td>
              <td>
                <button onClick={() => deleteItem(popular._id)} style={{backgroundColor: "red" , border :"none" , padding: "3px 5px" , color:"white"}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}
