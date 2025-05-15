export async function getStaticPaths() {
  const blogSlugs = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/slugs`,
    {
      method: "GET",
    }
  );
  const blogPaths = await blogSlugs.json();

  if (!blogSlugs.ok) {
    throw new Error("Failed to fetch product slugs");
  }

  return {
    paths: blogPaths.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    const { slug } = params;

    // Fetch the blog data
    const blogResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${slug}`
    );

    if (!blogResponse.ok) {
      return { notFound: true }; // Return 404 if blog not found
    }

    const blogData = await blogResponse.json();

    // Fetch popular products
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
        blog: blogData,
        products: products,
      },
      revalidate: 60, // Regenerate page every 60 seconds for fresh data
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { notFound: true };
  }
}


import { IBM, noto, rubik } from "@/config/fonts";
// Main part of the page
import st from "@/styles/blog.module.css";
import Image from "next/image";
import Slider from "react-slick";
import { formatNumber } from "@/components/numFunction";
import { useRouter } from "next/router";

const sliderSettings = {
  dots: true,
  infinite: true,
  centerMode: false,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default function BlogPage({ blog , products }) {

  const router = useRouter();

  return (
    <section className={st.thisClass} dir="rtl">
      <div id={st.backgroundMaker}></div>
      <article className={noto.className}>
        <h1 className={IBM.className}>{blog.blogName}</h1>
        <p className={IBM.className}>{blog.firstText}</p>
        <Image
          height={300}
          width={600}
          alt={`Image for ${blog.blogName}`}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/blogs/${blog.firstPicture}`}
          priority // For above-the-fold images
          sizes="(max-width: 768px) 100vw, 600px" // Responsive image sizing
          className={st.articlePic}
        />
        <p className={IBM.className}>{blog.secondText}</p>
        <Image
          height={300}
          width={600}
          
          alt={`Image for ${blog.blogName}`}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/blogs/${blog.secondPicture}`}
          sizes="(max-width: 768px) 100vw, 600px"
          className={st.articlePic}
        />

        <p className={IBM.className}>{blog.thirdText}</p>

        <aside className={`${st.offer} ${IBM.className}`}>
          <div className={st.offerFirst}>
            <h2 dir="rtl" className={IBM.className}>با ما همراه شو , به خودت تخفیف بده!</h2>
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
                    <div className={st.offerSlide} key={index} onClick={() => {
                      router.push(`${process.env.NEXT_PUBLIC_URL}/products/${product._id}`)
                    }}>
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
        </aside>

        <p className={IBM.className}>{blog.fourthText}</p>
        <div>Other Ad Content Here</div>
      </article>
    </section>
  );
}
