import React, { useEffect, useState } from "react";

const ProtectedPage = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/v1/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setData(result.message || result.error);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      <p>{data}</p>
    </div>
  );
};

export default ProtectedPage;