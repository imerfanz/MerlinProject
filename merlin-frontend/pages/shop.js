import { NextSeo } from "next-seo";
import Image from "next/image";
import st from "@/styles/shop.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";
import { IBM, noto, pacifico, rubik } from "@/config/fonts";
import { useRouter } from "next/router";
import { formatNumber } from "@/components/numFunction";
import { useCart } from "@/contextApi/shoppingCartContext/cartContext";
import { toast, ToastContainer } from "react-toastify";
import Slider from "react-slick";

function Shop({ shopItems }) {
  const router = useRouter();
  const { addToCart } = useCart();

  // states
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [formValue, setFormValue] = useState(["all"]);
  const [formError, setFormError] = useState(null);

  // Initial products fetch
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
        // Assuming 20 is the expected number of items per page
        setHasMore(false);
      }
      if (!response.ok) {
        response.status === 404
          ? setFormError("به زودی محصولات در این دسته بندی ...")
          : setFormError(data);
        throw new Error(data);
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
      //console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // On form Change
  const formChange = (e) => {
    setHasMore(true);
    const checkboxes = [
      e.target.parentElement[0],
      e.target.parentElement[1],
      e.target.parentElement[2],
    ];
    checkboxes.forEach((checkbox) => {
      const isChecked = Array.from(checkboxes).some(
        (checkbox) => checkbox.checked
      );

      e.target.parentElement[3].checked = !isChecked;
      e.target.parentElement[3].disabled = isChecked;
    });
    const nodes = Array.from(e.target.parentElement.querySelectorAll("input"));
    const checkedValues = nodes
      .filter((element) => element.checked)
      .map((element) => element.value);
    setFormValue(checkedValues);
    setItems([]);
    setFormError(null);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [formValue]);

  // Slider props
  const sliderProps = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <>
      <NextSeo title="فروشگاه" />
      <main className={st.main}>
        <section className={`${st.hero} ${IBM.className}`}>
          <div className={st.slider}>
            <Slider {...sliderProps} className={st.slideContain}>
              {shopItems ? (
                shopItems.map((item, index) => (
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
                    width={600}
                    height={300}
                    alt="merlin slider"
                    src={`/slider/fl2.jpg`}
                  />
                </div>
              )}
            </Slider>
          </div>
          <form onChange={formChange}>
            <input type="checkbox" value="coffee" id="check-coffee" />
            <label htmlFor="check-arabica">قهوه</label>
            <input type="checkbox" value="equipments" id="check-equipment" />
            <label htmlFor="check-equipment">تجهیزات</label>
            <input type="checkbox" value="others" id="check-others" />
            <label htmlFor="check-others">دیگر نوشیدنیها</label>
            <p></p>
            <input type="checkbox" value="all" id="check-all" defaultChecked />
            <label htmlFor="check-all" id={st.allLabel}>
              همه
            </label>
          </form>
        </section>
        <section className={`${st.products} ${IBM.className}`}>
          <InfiniteScroll
            className={`${st.contain} ${noto.className}`}
            dataLength={items.length}
            next={fetchData}
            hasMore={hasMore}
            scrollThreshold={"300px"}
            endMessage={
              <p
                style={{
                  color: "#d67016",
                }}
                id={st.endP}
              >
                همه رو دیدید !
              </p>
            }
            loader={
              <div key="loader" dir="rtl" style={{ flexBasis: "100%" }}>
                {isLoading && "بارگذاری..."}
              </div>
            }
          >
            {items.length >= 1 || items.name ? (
              items.map(
                (
                  item,
                  index // Check length before mapping
                ) => (
                  <div key={index} className={st.itemsDiv}>
                    {item?.offer > 0 && (
                      <div className={st.offerPic}>
                        <Image
                          src={"/offer.png"}
                          width={90}
                          height={90}
                          alt="محصول تخفیف دار قهوه مرلین"
                        />
                        <p className={pacifico.className}>{item.offer}%</p>
                      </div>
                    )}
                    {item.picture && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${item.picture}`}
                        width={200}
                        height={200}
                        alt={`${item.name} مرلین`}
                        onClick={() => {
                          router.push(`/products/${item._id}`);
                        }}
                      />
                    )}
                    <h3
                      onClick={() => {
                        router.push(`/products/${item._id}`);
                      }}
                    >
                      {item.name}
                    </h3>
                    <div className={`${pacifico.className} ${st.priceDiv}`}>
                      <p className={st.afterOffer}>
                        {item.offer > 0
                          ? formatNumber(
                              Math.round(
                                (item?.prices[0] * (100 - item.offer)) / 100
                              )
                            )
                          : null}
                      </p>
                      <p className={st.beforeOffer}>
                        {item.offer > 0 ? (
                          <b
                            style={{
                              textDecoration: "line-through",
                              textDecorationColor: "#57130a",
                              textDecorationThickness: "2px",
                            }}
                          >
                            {formatNumber(item?.prices[0])}
                          </b>
                        ) : (
                          <b style={{ textDecoration: "none" }}>
                            {formatNumber(item?.prices[0])}
                          </b>
                        )}{" "}
                        تومان
                      </p>
                    </div>
                    <div className={st.btnDiv}>
                      <button
                        onClick={async () => {
                          const fp =
                            (item.prices[0] * (100 - item.offer)) / 100;
                          const order = {
                            productId: item._id,
                            productName: item.name,
                            weight: `${
                              item.category.includes("equipments") ? "" : "گرم"
                            } ${item.weights[0]}`,
                            grind: item.category.includes("coffee")
                              ? "mid-grind"
                              : null,
                            number: 1,
                            finalPrice: fp,
                            picture: item.picture,
                          };
                          const tf = await addToCart(order);
                          tf
                            ? toast.success(`محصول به سبد خرید اضافه شد`)
                            : toast.error(`محصول به سبد خرید اضافه نشد`);
                        }}
                      >
                        <i className="fa fa-shopping-cart fa-2x" />
                      </button>
                      <button
                        onClick={() => {
                          router.push(`/products/${item._id}`);
                        }}
                      >
                        <i className="fa fa-eye fa-2x" />
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <div
                style={{
                  flexBasis: "100%",
                  direction: "rtl",
                  color: "#d67016",
                  fontSize: "18px",
                }}
              >
                {formError && formError}
              </div>
            )}
          </InfiniteScroll>
        </section>
        <ToastContainer />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const shopRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/picture/getSliders?location=shop`
  );
  const shopItems = await shopRes.json();

  return {
    props: {
      shopItems,
    },
  };
}

export default Shop;
