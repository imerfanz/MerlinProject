import st from "@/styles/adminForms.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";

export default function ShowUsers(props) {
  const [people, setPeople] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [searchNumber, setSearchNumber] = useState(null);

  // fetching function

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/showUsers?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: searchNumber }),
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
        throw new Error("Failed to fetch users");
      }
      // Check if it's the initial fetch and update the state accordingly
      if (isInitialFetch) {
        setPeople(data);
        setIsInitialFetch(false); // Set initial fetch to false
      } else {
        setPeople((prevItems) => [...prevItems, ...data]);
      }

      setPage(page + 1);
    } catch (error) {
      console.log(error);
      props.eToast("No or No more users!");
    } finally {
      setIsLoading(false);
    }
  };

  // Phone number change
  const phoneChange = (e) => {
    setSearchNumber(e.target.value);
    setPeople([]);
    setPage(1);
    console.log(searchNumber);
  };

  useEffect(() => {
    fetchData();
  }, [searchNumber]);

  // user password change

  return (
    <div className={st.thisClass}>
      <h2>Show Users</h2>
      <input
        type="text"
        style={{
          borderRadius: "10px",
          textAlign: "center",
          fontSize: "18px",
          height: "30px",
          border: "2px solid #1f2730",
        }}
        placeholder="phone number"
        onChange={phoneChange}
      />

      <InfiniteScroll
        dataLength={people.length}
        next={fetchData}
        hasMore={hasMore}
        scrollThreshold={"300px"}
        style={{ width: "100%", overflow: "visible" }}
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
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Lname</th>
              <th>Phone</th>
              <th>Pass</th>
              <th>balance</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {people.length >= 1 || people.name ? (
              people.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>
                    <form
                      style={{
                        flexDirection: "row-reverse",
                        justifyContent: "space-evenly",
                        width: "90%",
                        marginRight: "6%",
                      }}
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const newPassword = e.target[0].value;
                          const passChange = await fetch(
                            `${process.env.NEXT_PUBLIC_URL}/api/protected/adminRequest?path=changePass`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                id: user._id,
                                newPassword: newPassword,
                              }),
                            }
                          );
                          if (passChange.ok) {
                            props.sToast(await passChange.text());
                          } else {
                            props.eToast(await passChange.text());
                          }
                        } catch (error) {
                          props.eToast("خطا در ارسال");
                        }
                      }}
                    >
                      <input
                        type="text"
                        placeholder="pass change"
                        style={{ height: "25px" }}
                      />
                      <button
                        type="submit"
                        style={{
                          width: "60px",
                          height: "22px",
                          borderRadius: "7px",
                          fontSize: "15px",
                        }}
                      >
                        set
                      </button>
                    </form>
                  </td>
                  <td>{user.accountBalance}</td>
                  <td>{user._id}</td>
                </tr>
              ))
            ) : (
              <p></p>
            )}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}
