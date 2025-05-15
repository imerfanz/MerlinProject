import st from "@/styles/admin.module.css";
import { IBM, pacifico } from "@/config/fonts";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AddProductForm from "./components/addProduct";
import DeleteProduct from "./components/deleteProduct";
import EditProduct from "./components/editProduct";
import ShowUsers from "./components/showUsers";
import Pictures from "./components/controllPictures";
import Populars from "./components/populars";
import Blogs from "./components/controlBlogs";
import ShowOrders from "./components/showOrders";

export default function Admin(props) {
  const [activeComponent, setActiveComponent] = useState(""); // Initial active component

  // auth
  const [isAuthorized, setAuth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=auth`,
          { method: "POST" }
        );
        const tf = await response.text();
        console.log("res:", tf);
        if (tf === "true") {
          setAuth(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log("isAuthorized ", isAuthorized);
    // No cleanup function is needed in this case, so return undefined
    return undefined;
  }, []);

  // custom toast adjust

  const successCompsToast = (text) => {
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
  const errorCompsToast = (text) => {
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

  return (
    <main className={st.main}>
      {isAuthorized ? (
        <section>
          <header>
            <h1 className={pacifico.className}>Merlin Admin Dashboard</h1>
          </header>
          <aside>
            <nav className={st.nav}>
              <ul>
                <li
                  onClick={async () => {
                    await setActiveComponent("");
                    setActiveComponent("addProduct");
                  }}
                >
                  <p href="#">Add Product</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("deleteProduct");
                  }}
                >
                  <p href="#">Delete Product</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("editProduct");
                  }}
                >
                  <p href="#">Edit Product</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("showUsers");
                  }}
                >
                  <p href="#">Show Users</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("showOrders");
                  }}
                >
                  <p href="#">Show Orders</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("postedOrders");
                  }}
                >
                  <p href="#">Posted Orders</p>
                </li>
                <li>
                  <p href="#">Messages</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("blogs");
                  }}
                >
                  <p href="#">Blogs</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("pictures");
                  }}
                >
                  <p href="#">Pictures</p>
                </li>
                <li
                  onClick={() => {
                    setActiveComponent("");
                    setActiveComponent("populars");
                  }}
                >
                  <p href="#">Populars</p>
                </li>
              </ul>
            </nav>
          </aside>
          <article className={st.article}>
            {activeComponent === "addProduct" && (
              <AddProductForm
                sToast={successCompsToast}
                eToast={errorCompsToast}
              />
            )}
            {activeComponent === "deleteProduct" && (
              <DeleteProduct
                suToast={successCompsToast}
                erToast={errorCompsToast}
              />
            )}
            {activeComponent === "postedOrders" && (
              <ShowOrders
                suToast={successCompsToast}
                erToast={errorCompsToast}
              />
            )}
            {activeComponent === "editProduct" && (
              <EditProduct
                sToast={successCompsToast}
                eToast={errorCompsToast}
              />
            )}
            {activeComponent === "showUsers" && (
              <ShowUsers sToast={successCompsToast} eToast={errorCompsToast} />
            )}
            {activeComponent === "blogs" && (
              <Blogs sToast={successCompsToast} eToast={errorCompsToast} />
            )}
            {activeComponent === "pictures" && (
              <Pictures sToast={successCompsToast} eToast={errorCompsToast} />
            )}
            {activeComponent === "populars" && (
              <Populars sToast={successCompsToast} eToast={errorCompsToast} />
            )}
          </article>
        </section>
      ) : (
        <p
          dir="rtl"
          style={{
            textAlign: "center",
            marginTop: "150px",
            fontSize: "18px",
            fontWeight: "600",
          }}
          className={IBM.className}
        >
          ورود غیر مجاز !
        </p>
      )}
      <ToastContainer />
    </main>
  );
}
