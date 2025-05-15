import st from "@/styles/cart.module.css";
import modalCss from "@/styles/modal.module.css";
import { IBM, noto, pacifico, rubik } from "@/config/fonts";
import Image from "next/image";
import { useCart } from "@/contextApi/shoppingCartContext/cartContext";
import { useAuth } from "@/contextApi/authContext/logContext";
import { formatNumber } from "@/components/numFunction";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Cart(props) {
  const [updater, setUpdater] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const updateCart = (a) => {
    setUpdater(updater + a);
  };
  useEffect(() => {
    const totalPrice = cart.reduce(
      (accumulator, item) => accumulator + item.finalPrice,
      0
    );
    setTotalPrice(totalPrice);
  }, [cart]);

  // paying gate request and setup
  const [unpaid, setUnpaid] = useState(null);
  const [unpaidModal, setUnpaidModal] = useState(false);
  console.log(user);


  const pay = async () => {
    if(!user){
      toast.error("لطفا برای سفارش وارد اکانت شوید");
      return;
    }
    if (cart.length === 0) {
      toast.error("دوست من ، سبد شما خالیه");
      return;
    }
    const { affiliates, notifications, createdAt, ...userInfo } = user;
    const requestBody = { ...userInfo, orderArray: cart, useBalance: true };
    const backResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/zibal-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    // If we have an unpaid order , open a modal to access it
    if ((await backResponse.status) === 403) {
      const unpaidInfo = await backResponse.json();
      setUnpaid(unpaidInfo);
      setUnpaidModal(true);
      return;
    }
    const gateUrl = await backResponse.text();
    if (backResponse.ok) {
      router.push(gateUrl);
    } else {
      toast.error(gateUrl);
    }
  };

  return (
    <section className={st.thisClass} id={st.cartMain}>
      <h1 className={`${IBM.className}`}>
        سبد من <i className="fa fa-shopping-bag" />
      </h1>
      <div className={st.contain}>
        <div className={`${st.ctaPart} ${noto.className}`}>
          <span>
            <p className={st.ctaLabel}>مبلغ کل </p>
            <p className={`${st.ctaPrice} ${noto.className}`}>
              {formatNumber(totalPrice)} <b className={IBM.className}>تومان</b>
            </p>
          </span>
          <span>
            <p className={st.ctaLabel}>مبلغ کل + هزینه پست </p>
            <p className={`${st.ctaPrice} ${noto.className}`}>
              100,000 <b className={IBM.className}>تومان</b>
            </p>
          </span>
          <span>
            <p className={st.ctaLabel}> با کسر از حساب مرلین </p>
            <p className={`${st.ctaPrice} ${noto.className}`}>
              100,000 <b className={IBM.className}>تومان</b>
            </p>
          </span>
          <button className={IBM.className} onClick={pay}>
            تکمیل خرید
          </button>
          <span>
            <p className={st.ctaLabel}>حساب مرلین من </p>
            <p className={`${st.ctaPrice} ${noto.className}`}>
              100,000 <b className={IBM.className}>تومان</b>
            </p>
          </span>
        </div>
        <div>
          <table className={st.cartPart}>
            <thead>
              <tr className={IBM.className}>
                <th>تصویر</th>
                <th>نام محصول</th>
                <th>وزن</th>
                <th>تعداد</th>
                <th>قیمت</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              <CartComponent
                array={cart}
                updater={updater}
                update={updateCart}
              />
            </tbody>
          </table>
        </div>
      </div>
      {unpaidModal ? (
        <div
          className={`${modalCss.cartContainer} ${IBM.className}`}
          style={{ zIndex: 100 }}
        >
          <div
            className={modalCss.backdrop}
            onClick={() => {
              setUnpaid(null);
              setUnpaidModal(false);
            }}
          ></div>
          <div className={modalCss.cartModal} style={{ zIndex: 101 }}>
            <h2>سفارش پرداخت نشده {unpaid.fullName}</h2>
            <p>
              کاربر عزیز شما یک سفارش تکمیل نشده دارید. جهت ادامه خرید سفارش
              قبلی را حذف نموده یا آن را تکمیل کنید
            </p>
            <span>
              <h3>مبلغ نهایی</h3>
              <h3 style={{ color: "#000000e4" }}>
                {formatNumber(unpaid.orderFinishedPrice)}{" "}
                <i style={{ fontWeight: 500 }}>تومان</i>
              </h3>
            </span>
            <div className={modalCss.orderDiv}>
              {unpaid.order.map((item, index) => (
                <div key={index}>
                  <p style={{ fontWeight: "600" }}>{item.productName}</p>
                  <p
                    className={pacifico.className}
                    style={{ fontWeight: "500", paddingBottom: "4px" }}
                  >
                    {item.weight}
                  </p>
                  <p
                    className={pacifico.className}
                    style={{ fontWeight: "500", paddingBottom: "4px" }}
                  >
                    {item.number}
                  </p>
                  <p
                    className={pacifico.className}
                    style={{ fontWeight: "500", paddingBottom: "4px" }}
                  >
                    {formatNumber(item.finalPrice)}
                    <i className={IBM.className}>تومان</i>
                  </p>
                </div>
              ))}
            </div>
            <span>
              <button
                className={IBM.className}
                onClick={async () => {
                  try {
                    const backResponse = await fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/zibal-unpaid`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ orderId: unpaid._id }),
                      }
                    );
                    const gateUrl = await backResponse.text();
                    if (backResponse.ok) {
                      router.push(gateUrl);
                    } else {
                      toast.error(gateUrl);
                    }
                  } catch (error) {
                    toast.error("خطا در ارسال درخواست");
                  }
                }}
                style={{ backgroundColor: "#d10c10" }}
              >
                ادامه پرداخت
              </button>
              <button
                className={IBM.className}
                onClick={async () => {
                  try {
                    const backResponse = await fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/delete-order`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ orderId: unpaid._id }),
                      }
                    );
                    const responeText = await backResponse.text();
                    if (backResponse.ok) {
                      toast.success(responeText);
                      setUnpaidModal(false);
                      setUnpaid(null);
                    } else {
                      toast.error(responeText);
                    }
                  } catch (error) {
                    toast.error("خطا در ارسال درخواست");
                  }
                }}
                style={{ backgroundColor: "gray" }}
              >
                حذف سفارش
              </button>
            </span>
          </div>
        </div>
      ) : null}

      <ToastContainer />
    </section>
  );
}

const CartComponent = (props) => {
  const { deleteFromCart } = useCart();
  console.log(props);

  return props.array?.length ? (
    props.array.map((item, index) => (
      <tr key={index} className={`${st.cartItem} ${IBM.className}`}>
        <td>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${item.picture}`}
            width={100}
            height={100}
            alt={item.productName}
          />
        </td>
        <td className={st.itemName}>{item.productName}</td>
        <td className={st.itemWeight}>{item.weight}</td>
        <td className={st.itemNumber} style={{ color: "#064409" }}>
          {item.number}
        </td>
        <td className={st.itemPrice}>{formatNumber(item.finalPrice)}</td>
        <td>
          <i
            className="fa fa-times-circle"
            onClick={() => {
              const tf = deleteFromCart(item.productId);
              tf
                ? toast.success(`محصول از سبد خرید حذف شد`)
                : toast.error(`محصول حذف نشد`);
              props.update(1);
            }}
          />
        </td>
      </tr>
    ))
  ) : (
    <tr className={IBM.className}>
      <td colSpan="6" className={st.noCart}>
        محصولی در سبد خرید نیست
      </td>
    </tr>
  );
};
