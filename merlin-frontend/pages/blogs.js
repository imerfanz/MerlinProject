import { NextSeo } from "next-seo";
import Image from "next/image";
import st from "@/styles/blogs.module.css";
import { noto, rubik, IBM } from "@/config/fonts";
import Slider from "react-slick";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { formatNumber } from "@/components/numFunction";
import textShortner from "@/components/blogTextShortner";

const sliderSettings = {
  dots: true,
  infinite: true,
  arrows: false,
  centerMode: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
        infinite: true,
        dots: true,
      },
    },
  ],
};



function Blogs({ products }) {
  // navigation import
  const navigate = useRouter();



  // function and states to get all the blogs with react infinite
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/getBlogs?page=${page}`
      );

      setIsLoading(false); // Move setIsLoading(false) outside of fetch
      console.log("this works");

      const data = response.ok ? await response.json() : await response.text();

      if (data.length === 0 || data.length < 10) {
        setHasMore(false);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      if (isInitialFetch) {
        setItems(data);
        setIsInitialFetch(false); // Set initial fetch to false
      } else {
        setItems((prevItems) => [...prevItems, ...data]);
      }

      setPage(page + 1);
    } catch (error) {
      console.log(error);
      toast.error("Fetch failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NextSeo title="وبلاگ ها" />
      <main className={`${st.main}`}>
        <section className={`${IBM.className}`}>
          <div className={st.offer}>
            <div className={st.offerFirst}>
              <h2 dir="rtl">با ما همراه شو , به خودت تخفیف بده!</h2>
              <p>
                مرلین , کیفیت و طعم , تجربه‌ای متفاوت و اقتصادی از نوشیدن قهوه
              </p>
            </div>
            <div className={st.offerMid}>
              <button className={IBM.className}>
                <i className="fa fa-thumbs-up" />
                &nbsp; عضویت
              </button>
              <button className={IBM.className}>
                <i className="fa fa-user" />
                &nbsp; باشگاه مشتریان
              </button>
            </div>
            <div className={st.slickControll}>
              <Slider {...sliderSettings}>
                {products.map((product, index) => (
                  <div>
                    <div
                      className={st.offerSlide}
                      key={index}
                      onClick={() => {
                        navigate.push(
                          `${process.env.NEXT_PUBLIC_URL}/products/${product._id}`
                        );
                      }}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${product.picture}`}
                        width={110}
                        height={110}
                        alt="product"
                      />
                      <h3>{product.name}</h3>
                      <p>{formatNumber(product.prices[0])} تومان</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <h1 className={`${noto.className}`}>
            وبلاگ های درباره قهوه | قهوه مرلین
          </h1>
          <article>
            <div style={{ width: "100%" }}>
              <InfiniteScroll
                dataLength={items.length}
                className={st.blogContain}
                next={fetchData}
                hasMore={hasMore}
                scrollThreshold={"200px"}
                endMessage={
                  <p
                    style={{
                      color: "#d67016",
                      direction: "rtl",
                      fontSize: "18px",
                      flexBasis: "100%",
                      textAlign: "center",
                      position: "absolute",
                      top: "calc(100% - 50px)",
                      right: "0px",
                      width: "100%",
                      height: "50px",
                    }}
                  >
                    همه بلاگ ها را مشاهده کردید !
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
                      <div
                        key={index}
                        className={st.blogItems}
                        onClick={() => navigate.push(`/blogSlug/${item._id}`)}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/blogs/${item.firstPicture}`}
                          width={300}
                          height={300}
                          alt={`${item.blogName}`}
                        />
                        <h2 className={IBM.className}>{item.blogName}</h2>
                        <p>{textShortner(item.firstText , 27)}</p>
                        <button>مشاهده</button>
                        <i className="fa fa-heart" />
                        <pre>0</pre>
                      </div>
                    )
                  )
                ) : (
                  <div style={{ flexBasis: "100%" }}>There is no Blog</div>
                )}
              </InfiniteScroll>
            </div>
          </article>
        </section>
        <ToastContainer />
      </main>
    </>
  );
}

// fetching the resources on serverside loading
export async function getStaticProps({ params }) {
  try {    // Fetch popular products
    const resPopulars = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/populars`);
    const populars = resPopulars.ok ? await resPopulars.json() : [];

    // Fetch product details in batch
    const productRequests = populars.map((popular) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${popular.popId}`).then((res) =>
        res.ok ? res.json() : null
      )
    );

    const productResults = await Promise.all(productRequests);
    const products = productResults.filter((p) => p !== null);

    return {
      props: {
        products: products,
      },
      revalidate: 60, // Regenerate page every 60 seconds for fresh data
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { notFound: true };
  }
}

export default Blogs;
