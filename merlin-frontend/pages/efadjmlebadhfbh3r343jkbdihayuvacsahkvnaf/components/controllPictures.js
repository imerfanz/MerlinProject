import st from "@/styles/adminForms.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Pictures(props) {
  const [uploadFile, setUploadFile] = useState(null);
  const [pictureRatio, setPictureRatio] = useState("5/2");

  // Ratio change controll

  const ratioChange = (e) => {
    e.preventDefault();
    switch (e.target.value) {
      case "main":
        setPictureRatio("5/2");
        break;
      case "shop":
        setPictureRatio("4/1");
        break;
    }
  };

  // Form submit function
  const handlesubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("picture", uploadFile);
    formData.append("link", e.target[1].value);
    formData.append("webLocation", e.target[3].value);
    formData.append("slideNumber", e.target[2].value);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/protected/adminSetFile?path=picture`,
      {
        method: "POST",
        body: formData,
      }
    );
    const responseText = await response.text();
    if (response.ok) {
      toast.success(responseText);
    } else {
      toast.error(responseText);
    }
  };

  // function for fetching the shop slider pictures from server
  const [shopItems, setShopItems] = useState(null);
  const shopFetch = async () => {
    const shopPics = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/picture/getSliders?location=shop`
    );

    if (shopPics.ok) {
      const toJson = await shopPics.json();
      setShopItems(toJson);
    }
  };

  // function for fetching the shop slider pictures from server
  const [mainItems, setMainItems] = useState(null);
  const mainFetch = async () => {
    const mainPics = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/picture/getSliders?location=main`
    );
    if (mainPics.ok) {
      const toJson = await mainPics.json();
      setMainItems(toJson);
    }
  };

  useEffect(() => {
    shopFetch();
    mainFetch();
  }, []);

  return (
    <div className={st.thisClass}>
      <h2>Main Slider Pictures</h2>
      {mainItems ? (
        mainItems.map((item, index) => (
          <div key={index} style={{ position: "relative" }}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/sliders/${item.pictureName}`}
              width={500}
              height={200}
              style={{ borderRadius: "10px", filter: "brightness(60%)" }}
              alt="no image"
            />
            <p
              style={{
                position: "absolute",
                top: "5%",
                right: "3%",
                fontSize: "22px",
                color: "white",
                fontWeight: "600",
              }}
            >
              {item.slideNumber}
            </p>
            <p
              style={{
                position: "absolute",
                bottom: "6%",
                right: "3%",
                fontSize: "22px",
                color: "white",
                fontWeight: "500",
              }}
            >
              {item.link}
            </p>
            <p
              onClick={async () => {
                try {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=deletePicture`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: item._id }),
                    }
                  ).then(async (res) => {
                    const responseText = await res.text();
                    if (res.ok) {
                      props.sToast(responseText);
                    } else {
                      props.eToast(responseText);
                    }
                  });
                } catch (error) {
                  props.eToast("Error connecting to server");
                }
              }}
              style={{
                position: "absolute",
                top: "5%",
                left: "3%",
                fontSize: "22px",
              }}
              className={st.deleteSlider}
            >
              <i className="fa fa-trash" />
            </p>
          </div>
        ))
      ) : (
        <p>nothing here !</p>
      )}
      <h2>Shop Slider Pictures</h2>
      {shopItems ? (
        shopItems.map((item, index) => (
          <div key={index} style={{ position: "relative" }}>
            <Image
              alt="no image"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/sliders/${item.pictureName}`}
              width={500}
              height={125}
              style={{ borderRadius: "10px", filter: "brightness(60%)" }}
            />
            <p
              style={{
                position: "absolute",
                top: "5%",
                right: "3%",
                fontSize: "20px",
                color: "white",
                fontWeight: "600",
              }}
            >
              {item.slideNumber}
            </p>
            <p
              style={{
                position: "absolute",
                bottom: "6%",
                right: "3%",
                fontSize: "20px",
                color: "white",
                fontWeight: "500",
              }}
            >
              {item.link}
            </p>
            <p
              onClick={async () => {
                try {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=deletePicture`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: item._id }),
                    }
                  ).then(async (res) => {
                    const responseText = await res.text();
                    if (res.ok) {
                      props.sToast(responseText);
                    } else {
                      props.eToast(responseText);
                    }
                  });
                } catch (error) {
                  props.eToast("Error connecting to server");
                }
              }}
              style={{
                position: "absolute",
                top: "7%",
                left: "2%",
                fontSize: "20px",
              }}
              className={st.deleteSlider}
            >
              <i className="fa fa-trash" />
            </p>
          </div>
        ))
      ) : (
        <p>nothing here !</p>
      )}
      <h2>Add Pictures</h2>
      <form onSubmit={handlesubmit}>
        <input
          type="file"
          required
          accept="image/*"
          onChange={(e) => {
            e.preventDefault();
            setUploadFile(e.target.files[0]);
          }}
        />
        {uploadFile ? (
          <div>
            <img
              src={URL.createObjectURL(uploadFile)}
              alt="Uploaded Preview"
              style={{ width: "100%", aspectRatio: pictureRatio }}
            />
          </div>
        ) : null}
        <input type="text" placeholder="picture link (https://www.link.com)" required />
        <input
          type="number"
          placeholder="slide number from 1 to ..."
          min={"1"}
          required
        />
        <select onChange={ratioChange}>
          <option value={"main"}>Main Page slider {"( 5:2 ) "}</option>
          <option value={"shop"}>Shop Page slider {"( 4:1 ) "}</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ToastContainer />
    </div>
  );
}
