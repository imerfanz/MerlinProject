export async function getStaticPaths() {
  const productSlugs = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/slugs`,
    {
      method: "GET",
    }
  );
  const productPaths = await productSlugs.json();

  if (!productSlugs.ok) {
    throw new Error("Failed to fetch product slugs");
  }

  return {
    paths: productPaths.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
}
export async function getStaticProps({ params }) {
  const { slug } = params;

  const productData = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${slug}`,
    {
      method: "GET",
    }
  );
  const pD = await productData.json();
  return {
    props: {
      product: pD,
    },
  };
}

// actual component for the page
import { NextSeo } from "next-seo";
import st from "@/styles/slug.module.css";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/components/numFunction";
import { IBM, noto, pacifico, rubik } from "@/config/fonts";
import { useEffect, useState } from "react";
import { useCart } from "@/contextApi/shoppingCartContext/cartContext";
import { toast , ToastContainer } from "react-toastify";

export default function ProductPage({ product }) {
  const { addToCart } = useCart();
  const [priceTag, setPriceTag] = useState(
    (1 * (product?.prices[0] * (100 - product.offer))) / 100
  );
  const [beforeOffer, setBeforeOffer] = useState(product?.prices[0]);
  const [numeration, setNumeration] = useState(1);
  const [arrayNum, setArrayNum] = useState(0);

  // Price change controll
  const weightChange = (e) => {
    const num = e.target.options.selectedIndex;
    setArrayNum(num);
    setPriceTag(
      (numeration * (product.prices[num] * (100 - product.offer))) / 100
    );
    setBeforeOffer(numeration * product.prices[num]);
  };
  useEffect(() => {
    setPriceTag(
      (numeration * (product?.prices[arrayNum] * (100 - product.offer))) / 100
    );
    setBeforeOffer(numeration * product.prices[arrayNum]);
  }, [numeration]);

  // Form submit handling
  const onSubmit = async (e) => {
    e.preventDefault();
    const order = {
      productId: product._id,
      productName: product.name,
      weight: (`${product.category.includes('equipments') ? "" : "گرم"} ${e.target[0].value}`),
      grind: product.category.includes("coffee") ? e.target[1].value : null,
      number: numeration,
      finalPrice: priceTag,
      picture : product.picture,
    };
    const tf = await addToCart(order);
    tf ? toast.success(`محصول به سبد خرید اضافه شد`) : toast.error(`محصول به سبد خرید اضافه نشد`);
  };
  return (
    <>
      <NextSeo title={` ${product?.name} `} />
      <section className={`${st.productMain}`}>
        <div id={st.imgDiv}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/${product?.picture}`}
            width={450}
            height={450}
            alt={`${product?.name} مرلین `}
          />
        </div>
        <div id={st.expDiv} className={noto.className}>
          <h1 className={IBM.className}>{product?.name}</h1>
          <Link href={"/shop"}>
            <button className={IBM.className}>
              <i className="fa fa-arrow-right" />
              &nbsp; فروشگاه
            </button>
          </Link>
          <h2>توضیحات</h2>
          {product?.explanation ? (
            product.explanation[0].map((exp, index) => {
              return <h3 key={index}>{exp}</h3>;
            })
          ) : (
            <p>توضیحاتی برای این محصول ثبت نشده</p>
          )}
        </div>
        <div id={st.buyDiv} className={noto.className}>
          {product.offer ? (
            <div className={st.discountPic}>
              <Image
                src={"/discount.png"}
                width={150}
                height={100}
                alt="محصول تخفیف دار مرلین"
              />
              <p className={pacifico.className}>{product.offer}</p>
            </div>
          ) : null}
          <span className={st.fspan}>
            {product.offer ? (
              <pre className={`${st.beforePre} ${pacifico.className}`}>
                {formatNumber(beforeOffer)}
              </pre>
            ) : null}
            <pre className={`${st.pricePre} ${pacifico.className}`}>
              {formatNumber(priceTag)}
            </pre>
            <Image
              src={"/tomanpiccc.png"}
              width={140}
              height={50}
              alt="تومان"
            />
          </span>
          <form dir="rtl" onSubmit={onSubmit}>
            <div className={st.fContain}>
              <select onChange={weightChange} className={IBM.className}>
                {product?.weights
                  ? product.weights.map((weight, index) => {
                      return (
                        <option
                          key={index}
                          value={`${weight}`}
                          id={index}
                        >
                          {weight}{" "}
                          {product.category.includes("equipments")
                            ? ""
                            : "گرم"}{" "}
                        </option>
                      );
                    })
                  : null}
              </select>
              {product?.category.includes("coffee") ? (
                <select className={IBM.className}>
                  <option value="small-grind" className={rubik.className}>
                    آسیاب ریز
                  </option>
                  <option value="mid-grind" className={rubik.className}>
                    آسیاب متوسط
                  </option>
                  <option value="big-grind" className={rubik.className}>
                    آسیاب درشت
                  </option>
                </select>
              ) : null}
              <div id={st.numPicker} className={IBM.className}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    numeration > 1 ? setNumeration(numeration - 1) : null;
                  }}
                >
                  <i className="fa fa-minus" />
                </button>
                <p>{numeration}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    numeration < 5 ? setNumeration(numeration + 1) : null;
                  }}
                >
                  <i className="fa fa-plus" />
                </button>
              </div>
            </div>
            <pre className={IBM.className}>
              {product?.available ? "موجود" : "ناموجود"}
            </pre>
            <button className={IBM.className} id={st.sBtn}>
              اضافه به سبد خرید
            </button>
          </form>

          <span className={st.sspan}>
            <p>با لینک خود محصول را به اشتراک بگذارید !</p>
            <Image
              src={"/club/insicon.png"}
              width={36}
              height={36}
              alt={`لینک اینستاگرام محصول مرلین `}
            />
            <Image
              src={"/club/telicon.png"}
              width={35}
              height={35}
              alt={`لینک تگرام محصول مرلین `}
            />
            <Image
              src={"/club/whatsicon.png"}
              width={33}
              height={33}
              alt={`لینک واتساپ محصول مرلین `}
            />
            <pre className={rubik.className}>
              کپی لینک
              <i className="fa fa-copy fa-1x" />
            </pre>
          </span>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
