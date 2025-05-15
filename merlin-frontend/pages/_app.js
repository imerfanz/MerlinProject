import "@/styles/globals.css";
import "@/styles/navbar.css";
import "@/styles/footer.css";
import "slick-carousel/slick/slick.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
/////
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/navbar"));
////
import { CartProvider } from "@/contextApi/shoppingCartContext/cartContext";
import { AuthProvider } from "@/contextApi/authContext/logContext";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextSeo
        defaultTitle="قهوه مرلین"
        description="A brief description of your website"
        titleTemplate="قهوه مرلین | %s"
        openGraph={{
          url: "https://your-website.com",
          title: "My Website Title",
          description: "A brief description of your website",
          images: [
            {
              url: "https://your-website.com/image.jpg",
              width: 1200,
              height: 627,
              alt: "My Website Image",
            },
          ],
        }}
      />
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </>
  );
}
