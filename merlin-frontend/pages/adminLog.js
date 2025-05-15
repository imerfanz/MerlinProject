import ReCAPTCHA from "react-google-recaptcha";
import st from "@/styles/adminLog.module.css";
import { IBM } from "@/config/fonts";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

export default function AdminLog() {
  const [captcha, setCaptcha] = useState(false);

  const handleCaptchaChange = () => {
    setCaptcha(true);
  };

  const router = useRouter();
  // Login function
  const login = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target[0].value,
      password: e.target[1].value,
      password2: e.target[2].value,
    };
    try {
      if (captcha) {
        console.log(data);
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/adminlog` , {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          throw new Error(" ")
        }
        toast.success("ادمین تایید شد")
        router.replace('/efadjmlebadhfbh3r343jkbdihayuvacsahkvnaf')
      }else{
        toast.error("من ربات نیستم را تیک بزنید")
      }
    } catch (error) {
      toast.error(error)
      console.log(error);
    }

  };
  return (
    <section className={st.thisClass}>
      <form onSubmit={login}>
        <input placeholder="نام کاربری" type="text" className={IBM.className} />
        <input
          type="password"
          placeholder="رمزعبور"
          className={IBM.className}
        />
        <input
          type="password"
          placeholder="رمزعبور دوم"
          className={IBM.className}
        />
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
          theme="light"
          size="normal"
          hl="fa"
        />
        <button className={IBM.className}>ورود</button>
      </form>
      <ToastContainer />
    </section>
  );
}
