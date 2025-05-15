import { IBM, pacifico } from "@/config/fonts";
import st from "@/styles/orderCheck.module.css";
import { useRouter } from "next/router";
import { formatNumber } from "@/components/numFunction";

export default function OrderCheck(props) {
  const { isPayed, trackId, order, message, orderId } = props;
  console.log(props);
  return (
    <section className={st.thisClass}>
      <div className={`${st.container} ${IBM.className}`}>
        <h1>بررسی پرداخت های مرلین</h1>
        <p>کاربر عزیز، وضعیت سفارشات شما در صفحه کاربریتان قابل مشاهده است</p>
        {orderId && (
          <span>
            <p>{orderId}</p>
            <p>آیدی پیگیری سفارش</p>
          </span>
        )}
        {message && (
          <span>
            <p>{message}</p>
            <p>پیام درگاه پرداخت</p>
          </span>
        )}
        {trackId ? (
          <>
            <h3 style={{ color: isPayed ? "#008000" : "#ff0000" }}>
              {isPayed ? "پرداخت موفقیت آمیز" : "پرداخت انجام نشده"}
            </h3>
            <span>
              <p>{trackId}</p>
              <h4>کد رهگیری پرداخت</h4>
            </span>
          </>
        ) : (
          <h3 style={{ color: "#3f3f3f", marginBottom: "10%" }}>
            پرداختی وجود ندارد
          </h3>
        )}
        {order ? (
          <div className={st.orderContain}>
            {order.map((item, index) => (
              <div key={index}>
                <p style={{ fontWeight: "600" }}>-</p>
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
                  {formatNumber(item.finalPrice)}{" "}
                  <i className={IBM.className}>تومان</i>
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export async function getServerSideProps(context) {
  const { trackId, orderId } = context.query;

  // Validate query parameters
  if (!trackId || !orderId) {
    return {
      props: {
        trackId: null,
        isPayed: false,
        order: null,
        orderId: null,
        message: null,
      },
    };
  }
  try {
    const backResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/zibal-validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackId: trackId, orderId: orderId }),
      }
    );
    console.log(backResponse);
    // Handle the unpaid order
    if (backResponse === 403) {
      const { orderId, message } = await backResponse.json();
      return {
        props: {
          trackId: trackId,
          isPayed: false,
          order: null,
          orderId: orderId,
          message: message,
        },
      };
    } else if (backResponse === 400) {
      return {
        props: {
          trackId: null,
          isPayed: false,
          order: null,
          orderId: null,
          message: null,
        },
      };
    } else if (!backResponse.ok) {
      const { message } = await backResponse.json();
      return {
        props: {
          trackId: null,
          isPayed: false,
          order: null,
          orderId: null,
          message: message,
        },
      };
    }

    // If the order is payed successfully
    const { orderArray } = await backResponse.json();
    return {
      props: {
        trackId: trackId,
        isPayed: true,
        order: orderArray,
        orderId: null,
        message: null,
      },
    };
  } catch (error) {
    return {
      props: {
        trackId: null,
        isPayed: false,
        order: null,
        orderId: null,
        message: null,
      },
    };
  }
}
