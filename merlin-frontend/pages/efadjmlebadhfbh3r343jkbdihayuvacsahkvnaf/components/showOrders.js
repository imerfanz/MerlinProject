import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast, ToastContainer } from "react-toastify";
import st from "@/styles/adminForms.module.css";
import { formatNumber } from "@/components/numFunction";

export default function ShowOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/protected/adminRequest?path=getOrders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page: page }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) => {
          const newOrders = data.filter(
            (order) => !prev.some((o) => o._id === order._id)
          );
          return [...prev, ...newOrders];
        });
        setPage((prev) => prev + 1);
        if (data.length < 20) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("orders fetch error");
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <div className={st.thisClass}>
      <h2>Orders</h2>
      <InfiniteScroll
        dataLength={orders.length}
        next={fetchOrders}
        hasMore={hasMore}
        loader={<p>Loading orders...</p>}
        endMessage={<p>No more orders to show.</p>}
      >
        <div>
          <div className={st.orderItems}>
            <p className={st.orderP}>
              <i className="fa fa-square" style={{ scale: "0.5" }} />
            </p>
            <p className={st.orderP}>ID</p>
            <p className={st.orderP}>Date</p>
            <p className={st.orderP}>Price</p>
            <p className={st.orderP}>Post track ID</p>
          </div>
          {orders.map((order, index) => (
            <div key={index} className={st.orderItems}>
              <p className={st.orderP}>
                <i
                  className="fa fa-square"
                  style={{ scale: "0.5" }}
                  onClick={(e) => {
                    const targetDiv =
                      e.currentTarget.parentElement.parentElement.querySelector(
                        "div"
                      );
                    if (targetDiv) {
                      if (targetDiv.classList.contains(st.orderclose)) {
                        targetDiv.classList.remove(st.orderclose);
                        targetDiv.classList.add(st.orderopen);
                      } else {
                        targetDiv.classList.remove(st.orderopen);
                        targetDiv.classList.add(st.orderclose);
                      }
                    }
                  }}
                />
              </p>
              <p className={st.orderP}>{order.fullName}</p>
              <p className={st.orderP}>
                {new Date(order.payment.paidAt).toLocaleString()}
              </p>
              <p className={st.orderP}>{formatNumber(order.payment.amount)}</p>
              <p className={st.orderP}>
                <input type="text" style={{ width: "100px" }}></input>{" "}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "green",
                    border: "none",
                    width: "20px",
                    aspectRatio: "1/1",
                    borderRadius: "5px",
                  }}
                  onClick={async (e) => {
                    const postId =
                      e.currentTarget.parentElement.querySelector(
                        "input"
                      ).value;
                    const backResponse = await fetch(
                      `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=postOrder`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: order._id,
                          postTrackId: postId,
                        }),
                      }
                    );

                    const backResult = await backResponse.text();

                    console.log(backResult);
                    
                    if (backResponse.ok ) {
                      toast.success(backResult);
                    }else{
                      toast.error(backResult);
                    }
                  }}
                >
                  <i className="fa fa-check" />
                </button>
              </p>
              <div className={st.orderclose}>
                <p>
                  <strong>نام کامل : </strong> {order.fullName}
                </p>
                <p>
                  <strong> آدرس : </strong> {order.address}
                </p>
                <p>
                  <strong> شماره همراه : </strong> {order.phone}
                </p>
                <p>
                  <strong> کد پستی : </strong> {order.postalCode}
                </p>
                <p>
                  <strong> شهر : </strong> {order.city}
                </p>
                <p>
                  <strong> استان : </strong> {order.state}
                </p>
                <p>
                  <strong> کسر از حساب مرلین : </strong> {order.balanceUsed}
                </p>
                <p>
                  <strong> پرداخت شده : </strong>{" "}
                  {formatNumber(order.payment.amount)}
                </p>
                <p>
                  <strong> کمیسیون : </strong>{" "}
                  {order.paymentAfilliation
                    ? JSON.stringify(order.paymentAfilliation)
                    : "ندارد"}
                </p>
                <p>
                  <strong> آیدی سفارش : </strong> {order._id}
                </p>
                <p>
                  <strong> آیدی یوزر : </strong> {order.userId}
                </p>
                <h3> سقارش </h3>
                <ul>
                  <li>
                    <p>نام محصول</p>
                    <p>وزن</p>
                    <p>تعداد</p>
                    <p>آسیاب</p>
                    <p>قیمت</p>
                  </li>
                  {order.order.map((item, index) => (
                    <li key={index}>
                      <p>{item.productName}</p>
                      <p>{item.weight}</p>
                      <p>{item.number}</p>
                      <p>{item.grind && item.grind}</p>
                      <p>{formatNumber(item.finalPrice)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      <ToastContainer />
    </div>
  );
}
