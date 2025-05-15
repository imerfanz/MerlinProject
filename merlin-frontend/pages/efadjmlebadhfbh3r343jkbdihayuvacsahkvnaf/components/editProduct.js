import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import st from "@/styles/adminForms.module.css";
import Image from "next/image";
import EditProductPop from "./editProductPop";

export default function EditProduct(props) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [formValue, setFormValue] = useState(["all"]);

  // pop up states and setting for EditPop
  const [showPop, setShowPop] = useState({ display: "none" });
  const [popData, setPopData] = useState(null);
  const popShowHandler = (data) => {
    setPopData(data);
    setShowPop({display: "block"});
    console.log(data);
  };
  const hidePop = (d) => {
    setShowPop({display: "none"});
  }
  // reloading on every change in the selecting form
  const onChange = (e) => {
    setHasMore(true);
    const checkboxes = [
      e.target.parentElement[0],
      e.target.parentElement[1],
      e.target.parentElement[2],
      e.target.parentElement[3],
    ];
    checkboxes.forEach((checkbox) => {
      const isChecked = Array.from(checkboxes).some(
        (checkbox) => checkbox.checked
      );

      e.target.parentElement[4].checked = !isChecked;
      e.target.parentElement[4].disabled = isChecked;
    });
    const nodes = Array.from(e.target.parentElement.querySelectorAll("input"));
    const checkedValues = nodes
      .filter((element) => element.checked)
      .map((element) => element.value);
    setFormValue(checkedValues);
    setItems([]);
    setPage(1);
    console.log(formValue);
  };
  // data fetching function
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/show?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ array: formValue }),
        }
      ).finally(() => {
        setIsLoading(false);
      });
      console.log(response);

      const data = response.ok ? await response.json() : await response.text();
      if (data.length === 0 || data.length < 10) {
        setHasMore(false);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      // Check if it's the initial fetch and update the state accordingly
      if (isInitialFetch) {
        setItems(data);
        setIsInitialFetch(false); // Set initial fetch to false
      } else {
        setItems((prevItems) => [...prevItems, ...data]);
      }

      setPage(page + 1);
    } catch (error) {
      props.eToast("No or No more Products!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [formValue]);

  return (
    <div className={st.thisClass}>
      <h2>Edit Product</h2>
      <form
        style={{ flexDirection: "row", justifyContent: "space-evenly" }}
        onChange={onChange}
      >
        <input type="checkbox" value="robosta" id="check-robosta" />
        <label htmlFor="check-robosta">روبوستا</label>

        <input type="checkbox" value="coffee" id="check-arabica" />
        <label htmlFor="check-arabica">عربیکا</label>
        <input type="checkbox" value="equipments" id="check-equipment" />
        <label htmlFor="check-equipment">تجهیزات</label>
        <input type="checkbox" value="others" id="check-others" />
        <label htmlFor="check-others">دیگر نوشیدنیها</label>
        <p></p>
        <input type="checkbox" value="all" id="cjeck-all" defaultChecked />
        <label htmlFor="check-all">همه</label>
      </form>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchData}
        hasMore={hasMore}
        scrollThreshold={"300px"}
        endMessage={
          <p style={{ color: "#d67016", direction: "ltr", fontSize: "18px" }}>
            you have seen it all !
          </p>
        }
        loader={
          <div key="loader" dir="ltr">
            Loading...
          </div>
        }
      >
        {items.length >= 1 || items.name ? (
          items.map(
            (
              item,
              index // Check length before mapping
            ) => (
              <div key={index} className={st.prDiv}>
                {item.picture && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${item.picture}`}
                    width={200}
                    height={200}
                    alt="image"
                  />
                )}{" "}
                <p>{item.name}</p>
                <p>{item.prices ? item.prices[0] : "prices unavailable"}</p>
                <button
                  onClick={() => {
                    popShowHandler(item);
                  }}
                >
                  Edit
                </button>
              </div>
            )
          )
        ) : (
          <div>There is no product</div>
        )}
      </InfiniteScroll>
      <EditProductPop data={popData} display={showPop} hide={hidePop}/>
    </div>
  );
}
