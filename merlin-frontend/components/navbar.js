import Link from "next/link";
import { IBM, noto, pacifico, rubik } from "@/config/fonts";
import { useCart } from "@/contextApi/shoppingCartContext/cartContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/contextApi/authContext/logContext";
import { usePathname } from "next/navigation";

function Navbar(props) {
  const [cartLength, setCartLength] = useState(0);
  const [username, setUsername] = useState(null);
  const { cart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  useEffect(() => {
    if (!user) {
      setUsername(null);
    } else {
      setUsername(user.name);
    }
  }, [user]);

  // Color adjustment
  const pathname = usePathname();
  const isHome = pathname === "/";

    return (
      <nav className="nav-bar">
        <div id="nav-left-div" className={IBM.className}>
          <p>
            <Link href={"/cart"}>
              <i className="fa fa-shopping-cart">
                <span className={noto.className}>{cartLength}</span>
              </i>
            </Link>
          </p>
          <p className="middle">|</p>
          {!user ? (
            <p>
              <i className="fa fa-user" />
            </p>
          ) : (
            <p>
              <Link href={"/account"}>
                <i className="fa fa-user" />
              </Link>
            </p>
          )}
          {username ? (
            <p id="username">{username}</p>
          ) : (
            <Link href={"/form"}>
              <p
                id={"ozviat"}
                className={`${IBM.className}`}
              >
                ورود/عضویت
              </p>
            </Link>
          )}
        </div>

        <div id="nav-right-div" className={IBM.className}>
          <div>
            <Link href={"/contact"}>
              <p>
                تماس با ما
                <i className="fa fa-address-book" />{" "}
              </p>
            </Link>
            <Link href={"/club"}>
              <p>باشگاه مشتریان</p>
            </Link>
            <Link href={"/blogs"}>
              <p>وبلاگ ها</p>
            </Link>
            <Link href={"/shop"}>
              <p>
                محصولات
                <i className="fa fa-shopping-cart" />
              </p>
            </Link>
            <Link href={"/"}>
              <p>
                خانه
                <i className="fa fa-home" />
              </p>
            </Link>
            <pre className={pacifico.className}>Merlin</pre>
          </div>
          <i
            onClick={(e) => {
              console.log(e.target.parentElement);
              if (e.target.parentElement.style.height == "360px") {
                e.target.parentElement.style.height = "70px";
              } else {
                e.target.parentElement.style.height = "360px";
              }
            }}
            id="nav-more"
            className="fa fa-bars fa-2x"
          />
        </div>
      </nav>
    );
}

export default Navbar;
