import { IBM, noto, pacifico, rubik } from "@/config/fonts";
import st from "@/styles/account.module.css";
import { useAuth } from "@/contextApi/authContext/logContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

export default function Account(props) {
  const { user, logout } = useAuth();
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Form handling
  const completeForm = async (data) => {
    if (user?._id) {
      console.log({ _id: user._id, ...data });
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: user._id, ...data }),
      })
        .then(async (res) => {
          const text = await res.text();
          if (res.status === 200) {
            toast.success(text);
            location.reload();
          } else {
            toast.error(text);
          }
        })
        .catch((err) => {
          toast.error("خطا در ارسال اطلاعات");
          console.log(err);
        });
    } else {
      toast.error("لطفا وارد سایت شوید");
    }
  };
  // Making an Slider
  const [slidePosition, setPosition] = useState(-100);
  const slideBack = (e) => {
    e.preventDefault();
    setPosition(slidePosition - 100);
  };
  const slideForward = (e) => {
    e.preventDefault();
    setPosition(slidePosition + 100);
  };
  // Notifications handling
  // #9400d3 purple
  // Logout handling
  const out = async () => {
    const res = await logout();
    if (res == true) toast.success("از اکانت خارج شدید");
    if (res !== true) toast.error("خطا در خروج از اکانت");
  };

  // Orders fetching and setting
  const [orderLoading, setOrderLoading] = useState(true);
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?._id) {
        try {
          const backResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: user._id }),
            }
          );

          if (backResponse.ok) {
            const ordersResponse = await backResponse.json();
            setOrders(ordersResponse);
          } else if (backResponse.status === 500) {
            toast.error("خطای دریافت سفارش ها");
          }
        } catch (error) {
          toast.error("خطای درخواست سفارش ها");
        } finally {
          setOrderLoading(false);
        }
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className={st.main}>
      {user?.name ? (
        <div className={`${st.container} ${IBM.className}`}>
          {/* First part */}
          <div className={`${st.first} ${st.divStyle}`}>
            <div className={st.slider} style={{ left: `${slidePosition}%` }}>
              {/* Left slide*/}
              <form className={`${st.slideDivs} ${st.passSlide}`}>
                <input
                  type="text"
                  placeholder="نام"
                  className={IBM.className}
                />
                <fieldset>
                  <legend></legend>
                </fieldset>
                <input
                  type="password"
                  placeholder="رمز جدید"
                  className={IBM.className}
                />
                <input
                  type="password"
                  placeholder="تکرار رمز"
                  className={IBM.className}
                />
                <br />
                <br />
                <button
                  type="submit"
                  style={{ backgroundColor: "#1e1e5e" }}
                  className={IBM.className}
                >
                  ثبت تغییر
                </button>
                <button
                  onClick={slideBack}
                  className={IBM.className}
                  style={{ backgroundColor: "#435161" }}
                >
                  برگشت <i className="fa fa-arrow-right" />
                </button>
              </form>
              {/* Center slide*/}
              <div className={`${st.firstSlide} ${st.slideDivs}`}>
                <i className="fa fa-user-circle-o fa-5x" />
                <h1 style={{ color: "#435161" }}>
                  {user?.name} {user?.lastname}
                </h1>
                <h3 className={pacifico.className} id={st.phone}>
                  {user?.phone}
                </h3>
                <span dir="rtl">
                  <h3>ایمیل</h3>
                  {user?.email ? (
                    <p dir="ltr">{user.email}</p>
                  ) : (
                    <p className={st.notset}>نامشخص</p>
                  )}
                </span>
                <span dir="rtl">
                  <h3>شهر</h3>
                  {user?.city ? (
                    <p>
                      {user.state}/{user.city}
                    </p>
                  ) : (
                    <p className={st.notset}>نامشخص</p>
                  )}
                </span>
                <span dir="rtl">
                  <h3>کد پستی</h3>
                  {user?.postalCode ? (
                    <p>{user.postalCode}</p>
                  ) : (
                    <p className={st.notset}>نامشخص</p>
                  )}
                </span>
                <span dir="rtl" className={st.addressSpan}>
                  <h3>ادرس</h3>
                  {user?.address ? (
                    <p>{user.address}</p>
                  ) : (
                    <p className={st.notset}>نامشخص</p>
                  )}
                </span>
                <span className={st.buttonSpan}>
                  <button
                    className={`${IBM.className}`}
                    onClick={slideForward}
                    style={{
                      border: "2px solid #9400d3",
                      color: "#9400d3",
                      backgroundColor: "transparent",
                    }}
                  >
                    تغییر رمز / نام
                  </button>
                  <button
                    className={`${IBM.className}`}
                    onClick={slideBack}
                    style={{ backgroundColor: "#0f75cb" }}
                  >
                    تکمیل اطلاعات
                  </button>
                </span>
              </div>
              {/* Right slide*/}
              <form
                className={`${st.slideDivs} ${st.formSlide}`}
                onSubmit={handleSubmit(completeForm)}
              >
                <div>
                  <input
                    type="text"
                    placeholder="نام خانوادگی"
                    className={IBM.className}
                    {...register("lastname", {
                      required: "این قسمت را پر کنید",
                    })}
                  />
                  {errors.lastname && <p className={st.circleError}></p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="ایمیل"
                    className={IBM.className}
                    {...register("email", {
                      required: "این قسمت را پر کنید",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "ایمیل صحیح نمی باشد",
                      },
                    })}
                  />
                  <p>{errors.email && errors.email.message}</p>
                </div>
                <div>
                  <select
                    {...register("state")}
                    style={{ color: "#001022b9" }}
                    className={IBM.className}
                    dir="rtl"
                  >
                    <optgroup
                      className={IBM.className}
                      label="انتخاب استان ..."
                    >
                      <option value="تهران">تهران</option>
                      <option value="اصفهان">اصفهان</option>
                      <option value="فارس">فارس</option>
                      <option value="خوزستان">خوزستان</option>
                      <option value="کرمان">کرمان</option>
                      <option value="مازندران">مازندران</option>
                      <option value="گیلان">گیلان</option>
                      <option value="گلستان">گلستان</option>
                      <option value="سمنان">سمنان</option>
                      <option value="قزوین">قزوین</option>
                      <option value="البرز">البرز</option>
                      <option value="مرکزی">مرکزی</option>
                      <option value="همدان">همدان</option>
                      <option value="زنجان">زنجان</option>
                      <option value="اردبیل">اردبیل</option>
                      <option value="آذربایجان شرقی">آذربایجان شرقی</option>
                      <option value="آذربایجان غربی">آذربایجان غربی</option>
                      <option value="کردستان">کردستان</option>
                      <option value="کرمانشاه">کرمانشاه</option>
                      <option value="ایلام">ایلام</option>
                      <option value="لرستان">لرستان</option>
                      <option value="چهارمحال و بختیاری">
                        چهارمحال و بختیاری
                      </option>
                      <option value="کهگیلویه و بویراحمد">
                        کهگیلویه و بویراحمد
                      </option>
                      <option value="بوشهر">بوشهر</option>
                      <option value="هرمزگان">هرمزگان</option>
                      <option value="سیستان و بلوچستان">
                        سیستان و بلوچستان
                      </option>
                      <option value="یزد">یزد</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="نام شهر"
                    className={IBM.className}
                    {...register("city", { required: "این قسمت را پر کنید" })}
                  />
                  {errors.city && <p className={st.circleError}></p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="کد پستی (مثال: 13375-23456)"
                    className={IBM.className}
                    {...register("postalCode", {
                      required: "این قسمت را پر کنید",
                      pattern: {
                        value: /^\d{5}-\d{5}$/,
                        message:
                          "کد پستی وارد شده صحیح نیست (مثال: 13375-23456)",
                      },
                    })}
                  />
                  {errors.postcode && <p>{errors.postcode.message}</p>}
                </div>
                <div>
                  <textarea
                    type="textarea"
                    placeholder="آدرس منزل (مثال: خیابان/کوچه/پلاک/واحد)"
                    className={IBM.className}
                    {...register("address", {
                      required: "این قسمت را پر کنید",
                    })}
                  />
                  {errors.address && <p className={st.circleError}></p>}
                </div>
                <br />
                <button
                  className={IBM.className}
                  type="submit"
                  style={{ backgroundColor: "#9400d3" }}
                >
                  تکمیل اطلاعات
                </button>
                <button
                  className={IBM.className}
                  onClick={slideForward}
                  style={{ backgroundColor: "#435161" }}
                >
                  <i className="fa fa-arrow-left" /> بازگشت
                </button>
              </form>
            </div>
          </div>
          {/* Second part */}
          <div className={`${st.second}`}>
            <div className={`${st.secondDiv} ${st.divStyle}`}>
              <span dir="rtl">
                <h2 style={{ color: "#811507" }}>موجودی</h2>
                <p>0 تومان</p>
              </span>
              <div className={`${st.insideSec}`}>
                <span dir="rtl">
                  <pre className={IBM.className}>دوستان شما</pre>
                  <pre>{user?.affiliates.length}</pre>
                </span>
                <ul>
                  {user?.affiliates.map((friend, index) => (
                    <li key={index}>
                      {" "}
                      {friend}&nbsp; <i className="fa fa-user" />{" "}
                    </li>
                  ))}
                  <li>
                    {" "}
                    {"عرفان"}&nbsp; <i className="fa fa-user" />{" "}
                  </li>
                  <li>
                    {" "}
                    {"کیانا"}&nbsp; <i className="fa fa-user" />{" "}
                  </li>
                  <li>
                    {" "}
                    {"عرفان"}&nbsp; <i className="fa fa-user" />{" "}
                  </li>
                  <li>
                    {" "}
                    {"عرفان"}&nbsp; <i className="fa fa-user" />{" "}
                  </li>
                </ul>
              </div>
            </div>
            <div className={`${st.secondDiv} ${st.divStyle}`}>
              <span
                dir="rtl"
                style={{ color: "#fff", backgroundColor: "#0f75cb" }}
              >
                <h2>پیام ها</h2>
                <p>
                  {user?.notifications.length} <i className="fa fa-bell" />
                </p>
              </span>
              <ul dir="rtl" className={IBM.className}>
                {user?.notifications.map((notif, index) => (
                  <li
                    key={index}
                    className={`${
                      notif[1] == "true" ? st.delivered : st.unread
                    }`}
                  >
                    {notif[0]}
                    <p />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Third part */}
          <div className={`${st.third} ${st.divStyle}`}>
            <h2>لینک دعوت من</h2>
            <div>
              <i className="fa fa-copy" />
              <span>
                <p>{`${process.env.NEXT_PUBLIC_URL}/form?invite=${
                  user?._id ? user._id : ""
                }`}</p>
              </span>
            </div>
            <div>
              <button className={rubik.className} onClick={out}>
                خروج از حساب
              </button>
              <button
                className={rubik.className}
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_URL}/form?invite=${
                      user?._id ? user._id : ""
                    }`
                  );
                  alert("کپی شد!");
                }}
              >
                کپی لینک
              </button>
            </div>
          </div>
          {/* Fourth part */}
          <div className={`${st.fourth} ${st.divStyle}`}>
            <h2>وضعیت سفارش ها</h2>
            <div dir="rtl" className={`${IBM.className} ${st.orderContainer}`}>
              <div className={st.orderItems}>
                <p>
                  <i className="fa fa-circle" style={{ color: "#505050" }} />
                </p>
                <p>شماره سفارش</p>
                <p>وضعیت سفارش</p>
              </div>
              {orders?.length > 0 ? (
                orders.map((item, index) => (
                  <div key={index} className={`${st.orderItems}  ${st.close}`}>
                    <p className={IBM.className}>
                      <i className="fa fa-plus" />
                      {index + 1}
                    </p>
                    <p>{item._id}</p>
                    {!item.payment && (
                      <p
                        style={{
                          color: "#FF0000",
                          fontWeight: "600",
                          opacity: "0.7",
                        }}
                      >
                        پرداخت نشده
                      </p>
                    )}
                    {item.payment && item.isDelivered ? (
                      <p
                        style={{
                          color: "#388E3C",
                          fontWeight: "600",
                          opacity: "0.8",
                        }}
                      >
                        پست شده
                      </p>
                    ) : null}
                    {item.payment && !item.isDelivered ? (
                      <p
                        style={{
                          color: "#FFA500",
                          fontWeight: "600",
                          opacity: "0.7",
                        }}
                      >
                        آماده سازی
                      </p>
                    ) : null}
                    <div
                      className={st.hitBox}
                      onClick={(e) => {
                        const clss = e.target.parentElement;
                        clss.classList.toggle(st.close);
                        clss.classList.toggle(st.expand);
                        clss
                          .querySelector(".fa-plus")
                          .classList.toggle(st.rotate);
                      }}
                    ></div>
                    <div className={st.orderBody}>
                      {!item.payment && (
                        <span>
                          <button
                            className={IBM.className}
                            style={{ backgroundColor: "#fc3c3c" }}
                          >
                            ادامه پرداخت
                          </button>
                          <button
                            className={IBM.className}
                            style={{ backgroundColor: "#00202593" }}
                          >
                            حذف سفارش
                          </button>
                        </span>
                      )}
                      {item.isDelivered && (
                        <span style={{margin: "auto" ,paddingBottom: "20px" , paddingTop : "10px", gap:"30%" , width: "75%"}}>
                          <pre
                            className={IBM.className}
                            style={{ color: "#474747" }}
                          >
                            کد رهگیری پستی
                          </pre>
                          <pre
                            className={IBM.className}
                            style={{ color: "#a9a9a9" }}
                          >
                            {item.isDelivered}
                          </pre>
                        </span>
                      )}
                      <ul>
                        {item.order.map((orItem, index) => (
                          <li key={index}>
                            <p style={{ width: "5%", fontWeight: "600" }}>-</p>
                            <p style={{ width: "55%" }}>{orItem.productName}</p>
                            <p style={{ width: "20%" }}>{orItem.weight}</p>
                            <p style={{ width: "20%" }}>{orItem.number}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className={st.orderItems}>
                  <p
                    style={{
                      color: "#814511",
                      paddingTop: "10px",
                      width: "100%",
                    }}
                  >
                    سفارشی ثبت نشده!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p id={st.noUser} className={IBM.className}>
          لطفا وارد سایت شوید
        </p>
      )}
      <ToastContainer />
    </section>
  );
}
