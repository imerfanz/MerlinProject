import Image from "next/image";
import {
    Inter,
    Rubik,
    IBM_Plex_Sans_Arabic,
    Noto_Naskh_Arabic,
    Pacifico,
  } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["latin"], weight: "400", style: ["normal"] });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const noto = Noto_Naskh_Arabic({ subsets: ["latin"], weight: "500", style: ["normal"]});
const IBM = IBM_Plex_Sans_Arabic({ subsets: ["latin"], weight: "400" });


function Footer() {
  return (
    <footer className={`${"footer"} ${IBM.className}`}>
      <div className={"logo"}>
        <Image
          src={"/merlin-logo-hq.png"}
          width={250}
          height={250}
          alt="لوگوی مرلین- merlin logo"
        />
      </div>
      <div className={"contact"}>
        <h4>تماس با ما</h4>
        <span>
          <i className="fa fa-instagram fa-2x" />
          <i className="fa fa-whatsapp fa-2x" />
          <i className="fa fa-telegram fa-2x" />
          <i className="fa fa-linkedin fa-2x" />
        </span>
        <div>
          <h4 style={{ marginBottom: "7px" }}>پشتیبانی واتساپ</h4>
          <p>+98 938 372 4269</p>
          <i className="fa fa-phone fa-3x" />
        </div>
      </div>
      <div className={"post"}>
        <h4>نحوه ارسال</h4>
        <div>
          <p>سفارش محصول<i className="fa fa-laptop fa-2x" style={{color : '#021d02'}}/></p>
          <i className="fa fa-arrow-right" />
          <p>تحویل به پست پیشتاز<i className="fa fa-envelope-open fa-2x" style={{color : '#0d1927'}}/></p>
          <i className="fa fa-arrow-right" />
          <p>ارسال به سراسر کشور<i className="fa fa-truck fa-2x" style={{color : '#810000'}}/></p>
        </div>
      </div>
      <div className={"etemad"}>
        <h4>نماد اعتماد الکترونیک</h4>
      </div>
    </footer>
  );
}
export default Footer;
