import { NextSeo } from "next-seo";
import Image from "next/image";
import st from "@/styles/club.module.css";
import { IBM , rubik , inter } from "@/config/fonts";
import Link from "next/link";



function Club(props) {
  return (
    <>
      <NextSeo title="باشگاه مشتریان" />
      <main className={`${st.main} ${IBM.className}`}>
        <section className={`${st.sc1}`} dir="rtl">
          <div>
            <h2>
              باشگاه مشتریان <span>قهوه مرلین</span>
            </h2>
            <h1>یک پیشنهاد عالی برای تو و دوستانت!</h1>
            <p>
              همین حالا دوستت رو به یه فنجان قهوه‌ی عالی دعوت کن و خودت هم از
              تخفیفات ویژه بهره‌مند شو! با معرفی فروشگاه ما به دوستانت، 7% از هر
              خریدشون به حسابت واریز میشه. پس فرصت رو از دست نده ...
            </p>
            <Link href={'/form'}>
              <button className={rubik.className}>عضویت در سایت</button>
            </Link>
          </div>
          <div id={st.imgDiv}>
            <h3>قهوه رایگان</h3>
            <Image
              src={"/club/clubad.png"}
              width={500}
              height={500}
              alt="عکس تخفیف های باشگاه مشتریان فروشگاه مرلین"
            />
          </div>
        </section>
        <section className={`${st.sc2}`} dir="rtl">
          <ul>
            <li>عضو سایت ما شوید</li>
            <li id={st.inviteli}>
              دوستان خودت را دعوت کنید
              <Image
                src={"/club/insicon.png"}
                width={32}
                height={32}
                alt="ایکون اینستاگرام فروشگاه قهوه مرلین"
              />
              <Image
                src={"/club/whatsicon.png"}
                width={30}
                height={30}
                alt="ایکون واتساپ فروشگاه قهوه مرلین"
              />
              <Image
                src={"/club/telicon.png"}
                width={30}
                height={30}
                alt="ایکون تلگرام فروشگاه قهوه مرلین"
              />
            </li>
            <li>کد معرف خود را به آنها بدهید </li>
            <li>از هر پرداخت آنها 7 درصد دریافت کنید</li>
            <li>با دریافتی ها محصول خود را سفارش دهید{"(قهوه یا ...)"}</li>
          </ul>
        </section>
      </main>
    </>
  );
}

export default Club;
