import st from "@/styles/adminForms.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast, ToastContainer } from "react-toastify";

export default function Blogs(props) {
  // picture states
  const [fPic, setFPic] = useState(null);
  const [sPic, setSPic] = useState(null);

  // submit blog adding
  const blogSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("blogName", e.target[0].value);
      formData.append("firstText", e.target[1].value);
      formData.append("firstPicture", fPic);
      formData.append("secondText", e.target[3].value);
      formData.append("secondPicture", sPic);
      formData.append("thirdText", e.target[5].value);
      formData.append("fourthText", e.target[6].value);

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/protected/adminSetFile?path=addBlog`,
        {
          method: "POST",
          body: formData,
        }
      );

      const resText = await backendResponse.text();
      if (backendResponse.status == 200) {
        toast.success(resText);
      } else {
        toast.error(resText);
      }
    } catch (error) {
      console.log(error);
      toast.error("fetch failed");
    }
  };

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
      ).finally(() => {
        setIsLoading(false);
      });

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
      console.log(data);

      setPage(page + 1);
    } catch (error) {
      console.log(error);
      toast.error("Fetch failed");
    }
  };

  // function for deleting one whole blog
  const deleteBlog = async (e) => {
    e.preventDefault();
    const id = e.target[0].value;
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=deleteBlog`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }
    );

    const response = await backendResponse.text();
    console.log(response);
    if (backendResponse.ok) {
      toast.success(response);
    } else {
      toast.error(response);
    }
  };
  
  return (
    <div className={st.thisClass}>
      <h2>Add Blogs</h2>
      <form onSubmit={blogSubmit}>
        <input type="text" placeholder="Blog Name..." required />
        <textarea
          placeholder="First Text"
          style={{ maxWidth: "100%", minWidth: "100%" }}
          required
        />
        <input
          type="file"
          placeholder="First picture"
          accept="image/*"
          onChange={(e) => {
            e.preventDefault();
            setFPic(e.target.files[0]);
          }}
          required
        />
        <textarea
          placeholder="Second Text"
          style={{ maxWidth: "100%", minWidth: "100%" }}
          required
        />
        <input
          type="file"
          placeholder="Second picture"
          accept="image/*"
          onChange={(e) => {
            e.preventDefault();
            setSPic(e.target.files[0]);
          }}
          required
        />
        <textarea
          placeholder="Third Text"
          style={{ maxWidth: "100%", minWidth: "100%" }}
          required
        />
        <textarea
          placeholder="Frouth Text"
          style={{ maxWidth: "100%", minWidth: "100%" }}
          required
        />
        <button type="submit">Add</button>
      </form>
      <h2>Delete Blogs</h2>
      <form onSubmit={deleteBlog}>
        <input type="text" placeholder="Blog ID ..." required />
        <button type="submit">Delete</button>
      </form>
      <h2>Show Blogs</h2>
      <div>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchData}
          hasMore={hasMore}
          scrollThreshold={"300px"}
          endMessage={
            <p style={{ color: "#d67016", direction: "ltr", fontSize: "18px" }}>
              you have seen it all !
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
                <div key={index} className={st.prDiv}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/blogs/${item.firstPicture}`}
                    width={200}
                    height={200}
                    alt="image"
                  />
                  <h3>{item.blogName}</h3>
                  <p>{item._id}</p>
                </div>
              )
            )
          ) : (
            <div>There is no Blog</div>
          )}
        </InfiniteScroll>
      </div>
      <ToastContainer />
    </div>
  );
}
