import st from "@/styles/form.module.css";
import Image from "next/image";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import { useState , useEffect} from "react";
import { IBM, inter, rubik, noto, pacifico } from "@/config/fonts";
import { useAuth } from "@/contextApi/authContext/logContext";
import { useRouter } from "next/router";

export default function Form(props) {
  // Invitation Checking
  const router = useRouter();
  const [invitation, setInvitaion] = useState(null);
  useEffect(() => {
    const { invite } = router.query;
    if (invite) setInvitaion(invite);
  }, [router.query]);
  // Toast handling
  const toastStyle = {
    draggable: true,
    style: {
      backgroundColor: "#293d4e",
      color: "white",
      fontFamily: "B Nazanin, Arial, sans-serif",
      boxShadow: "-2px 2px 4px 1px rgba(0, 0, 0, 0.2)", // Adjust shadow properties
    },
  };

  // Register From adjustment
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const form1submit = (data) => {
    if (data.password == data.password2) {
      if (captcha === true) {
        const obj = { ...data, invitedBy: invitation };
        console.log(obj);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/reg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then(async (res) => {
            const respone = res.ok ? await res.text() : await res.text();
            if (res.ok) {
              toast.success(respone, toastStyle);
              console.log(respone);
            } else {
              toast.error(respone, toastStyle);
              console.log(respone);
            }
          })
          .catch(() => {
            toast.error("خطا در ارسال اطلاعات", toastStyle);
          });
        console.log("Form data:", data, "Errors:", errors);
      } else {
        toast.error("لطفا من ربات نیستم را تیک بزنید", toastStyle);
      }
    } else {
      toast.error("عدم مطابقت رمز های عبور ", toastStyle);
    }
  };

  // Login Form adjustment
  const { userLog } = useAuth();
  const form2submit = (e) => {
    e.preventDefault();
    const obj = {
      phone: e.target[0].value,
      password: e.target[1].value,
    };
    if (captcha) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then(async (res) => {
          try {
            if (!res.ok) {
              throw new Error(await res.text());
            }

            const data = await res.json();
            const object = await data.object;
            const msg = await data.message;
            userLog(object);
            toast.success(msg, toastStyle);
          } catch (error) {
            toast.error(error.message, toastStyle);
          }
        })
        .catch(() => {
          toast.error("خطا در ارسال", toastStyle);
        });
    } else {
      toast.error("لطفا من ربات نیستم را تیک بزنید", toastStyle);
    }
  };
  // Froms show and hide buttons
  const [f1Disp, setF1Disp] = useState({ display: "none" });
  const [f2Disp, setF2Disp] = useState({ display: "flex" });
  const showf1 = () => {
    setF1Disp({ display: "flex" });
    setF2Disp({ display: "none" });
  };
  const showf2 = () => {
    setF2Disp({ display: "flex" });
    setF1Disp({ display: "none" });
  };

  // controlling captcha
  const [captcha, setCaptcha] = useState(true);
  const handleCaptchaChange = () => {
    setCaptcha(true);
  };

  return (
    <>
      <main className={st.main}>
        <section>
          <div className={`${st.fdiv} ${IBM.className}`}>
            <form
              className={`${st.f1} ${IBM.className}`}
              style={f1Disp}
              onSubmit={handleSubmit(form1submit)}
            >
              <div>
                <input
                  type="text"
                  placeholder="تلفن همراه"
                  className={IBM.className}
                  id={st.email}
                  {...register("phone", {
                    required: "این قسمت را پر کنید",
                    pattern: {
                      value: /^09\d{9}$/,
                      message: " شماره صحیح نمی باشد. مثال : 09171231212",
                    },
                  })}
                />
                <p className={st.errors}>
                  {errors.phone && errors.phone.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="نام"
                  className={IBM.className}
                  {...register("name", { required: "این قسمت را پر کنید" })}
                />
                <p className={st.errors}>
                  {errors.name && errors.name.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="نام خانوادگی (اختیاری)"
                  className={IBM.className}
                  {...register("lastname", { required: false })}
                />
                <p className={st.errors}>
                  {errors.lastname && errors.lastname.message}
                </p>
              </div>
              <div>
                <input
                  type="password"
                  className={IBM.className}
                  placeholder="رمز عبور"
                  {...register("password", {
                    required: "این قسمت را پر کنید",
                    minLength: {
                      value: 8,
                      message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
                    },
                  })}
                />
                <p className={st.errors}>
                  {errors.password && errors.password.message}
                </p>
              </div>
              <div>
                <input
                  type="password"
                  className={IBM.className}
                  placeholder="تکرار رمز عبور"
                  {...register("password2", {
                    required: "این قسمت را پر کنید",
                    minLength: {
                      value: 8,
                      message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
                    },
                  })}
                />
                <p className={st.errors}>
                  {errors.password2 && errors.password2.message}
                </p>
              </div>
              <input
                type="submit"
                value={"ثبت نام"}
                className={IBM.className}
              />
            </form>
            <form className={`${st.f2}`} style={f2Disp} onSubmit={form2submit}>
              <input
                type="text"
                required
                placeholder="تلفن همراه"
                className={IBM.className}
              />
              <input
                type="password"
                required
                placeholder="رمز عبور"
                className={IBM.className}
              />
              <input
                type="submit"
                value={"ورود به سایت"}
                className={IBM.className}
              />
            </form>
            <div className={st.rcDiv}>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                theme="light"
                size="normal"
                hl="fa"
              />
            </div>
            <div className={st.showfs}>
              <p onClick={showf1}>ثبت نام</p>
              <pre>|</pre>
              <p onClick={showf2}>ورود به سایت</p>
            </div>
          </div>
          <div className={st.imgDiv}>
            <Image
              src={"/form1.png"}
              width={314}
              height={600}
              alt="عکس لاته آزت با قهوه مرلین"
            />
            <h1 className={IBM.className}>به جمع دوستداران قهوه بپیوندید</h1>
          </div>
        </section>
        <div>
          <ToastContainer className={IBM.className} />
        </div>
      </main>
    </>
  );
}
