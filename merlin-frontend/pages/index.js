import Image from "next/image";
import st from "@/styles/Home.module.css";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { IBM, noto, rubik, pacifico, inter } from "@/config/fonts";
import { formatNumber } from "@/components/numFunction";
import textShortner from "@/components/blogTextShortner";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};
const popsliderSettings = {
  dots: true,
  infinite: true,
  centerMode: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 490,
      settings: {
        fade: true,
        centerMode: false,
        speed: 700,
      },
    },
  ],
};

export default function Home({ mainItems, products, blogs }) {
  const router = useRouter();
  return (
    <>
      <NextSeo title="خانه" />
      <main className={`${st.main} ${inter.className}`}>
        <section className={st.hero}>
          <div className={`${st.rightHero} ${pacifico.className}`}>
            <Image
              src={"/index/cupic.png"}
              id={st.pic1}
              width={600}
              height={600}
              alt="تصویر  قهوه و دانه قهوه مرلین"
            />
            <span id={st.sp1}>
              <p>Americano</p>
            </span>
            <span id={st.sp2}>
              <p dir="ltr">
                4.8&nbsp;
                <i className="fa fa-star" />
              </p>
            </span>
            <span id={st.sp3}>
              <p>18k</p>
            </span>
          </div>
          <div className={`${st.leftHero} ${IBM.className}`}>
            <pre className={IBM.className}>
              فروشگاه اینترنتی <span>قهوه مرلین</span>
            </pre>
            <h1 className={IBM.className}>قهوه مرلین , یک جرعه لذت!</h1>
            <p>
              با یک فنجان قهوه، تمرکز و انرژیتان را افزایش دهید، خلاقیت‌تان را
              شکوفا کنید و روز پربار و لذتبخشی را تجربه کنید.
            </p>
            <button className={`${IBM.className} ${st.ctaButton}`}>
              <Link href={"/shop"}>
                <i className="fa fa-shopping-cart" />
                &nbsp; خرید قهوه
              </Link>
            </button>
            <div className={st.slider}>
              <Slider {...sliderSettings}>
                {mainItems ? (
                  mainItems.map((item, index) => (
                    <div className={st.slDiv} key={index}>
                      <Image
                        width={600}
                        height={300}
                        alt="merlin slider"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/sliders/${item.pictureName}`}
                        onClick={() => router.push(item.link)}
                      />
                    </div>
                  ))
                ) : (
                  <div className={st.slDiv}>
                    <Image
                      width={682}
                      height={384}
                      alt="merlin slider"
                      src={`/slider/fl2.jpg`}
                    />
                  </div>
                )}
              </Slider>
            </div>
          </div>
        </section>
        <div className={st.horizontal}>
          <div>
            <Image
              src={"/index/i1.jpg"}
              alt="مدیر در حال نوشیدن قهوه مرلین"
              width={350}
              height={225}
            />
            <Image
              src={"/index/i2.jpg"}
              alt="دختر در حال نوشیدن قهوه مرلین"
              id={st.centerImg}
              width={350}
              height={225}
            />
            <Image
              src={"/index/i3.jpg"}
              alt="کابوی در حال نوشیدن قهوه مرلین"
              width={350}
              height={225}
            />
          </div>
          <p className={`${IBM.className}`}>اصالت , کیفیت , تازگی</p>
        </div>
        <section className={`${st.populars} ${rubik.className}`}>
          <h2>پرفروش ها</h2>
          <Slider
            className={`${st.popslider} homepslide`}
            {...popsliderSettings}
          >
            {products.map((product, index) => (
              <div>
                <div className={st.poppr}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${product.picture}`}
                    width={200}
                    height={200}
                    alt={product.name}
                  />
                  <h3>{product.name}</h3>
                  <p>{formatNumber(product.prices[0])} تومان</p>
                  <button
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    مشاهده
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        <section className={`${st.aboutus} ${rubik.className}`}>
          <div>
            <h2>درباره ما</h2>
            <p dir="rtl">
              ما یک جامعه پر شور هستیم که به قهوه به عنوان یک تجربه مشترک نگاه
              میکنیم و خود را متعهد به ارائه بهترین و تازه ترین قهوه با رست حرفه
              ایی میدانیم.ما تنها یک قهوه نمیفروشیم بلکه یک تجربه لذتبخش را
              ارائه میدهیم و با آفر های گوناگون و متعدد سعی داریم بیشترین صرفه
              اقتصادی را برای شما به ارمغان بیاوریم.
            </p>
            <span>
              <button className={`${IBM.className} ${st.ctaButton}`}>
                <i className="fa fa-shopping-cart" />
                &nbsp; سفارش قهوه
              </button>
              <button className={`${IBM.className} ${st.ctaButton}`}>
                <i className="fa fa-user" />
                &nbsp; باشگاه مشتریان
              </button>
            </span>
          </div>
          <Image
            src={"/index/abus.png"}
            width={500}
            height={400}
            alt="لیوان های قهوه"
          />
        </section>
        <section className={`${st.blogs} ${rubik.className}`}>
          <h2>وبلاگ ها</h2>
          <div className={`${st.contain} ${rubik.className}`}>
            {blogs.map((blog, index) => (
              <div key={index} onClick={() => router.push(`/blogSlug/${blog._id}`)}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/blogs/${blog.firstPicture}`}
                  width={350}
                  height={125}
                  alt={blog.blogName}
                />
                <h3>{blog.blogName}</h3>
                <p>{textShortner(blog.firstText, 30)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch blogs for main page
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/getBlogs?page=1`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await response.json();
    const blogs = data.slice(0, 4);

    // Fetch main slider images
    const mainRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/picture/getSliders?location=main`
    );
    if (!mainRes.ok) {
      throw new Error(`Failed to fetch sliders, status: ${mainRes.status}`);
    }
    const mainItems = await mainRes.json();

    // Fetch popular products
    const resPopulars = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/populars`
    );
    const populars = resPopulars.ok ? await resPopulars.json() : [];

    // Fetch product details in batch
    const productRequests = populars.map((popular) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${popular.popId}`
      ).then((res) => (res.ok ? res.json() : null))
    );
    const productResults = await Promise.all(productRequests);
    const products = productResults.filter((p) => p !== null);

    return {
      props: {
        mainItems,
        products,
        blogs,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    // Provide fallback data to prevent crashes
    return {
      props: {
        mainItems: [],
        products: [],
        blogs: [],
      },
    };
  }
}
