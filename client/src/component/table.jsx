import axios from "axios";
import React, { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/transactions/",
      baseURL: "http://localhost:9001",
    })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <h3 style={{padding:"2rem"}}>
            <center><b>Transactions Details</b></center>
          </h3>
          <table class="table table-striped" style={{padding:"2rem"}}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Sender Address</th>
                <th scope="col">Amount</th>
                <th scope="col">Receiver Address</th>
                <th scope="col">Hash</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((el) => {
                  return (
                    <tr key={el.id}>
                      <th scope="row">{el.id}</th>
                      <td>{el.senderAddress}</td>
                      <td>{el.amount} ETH</td>
                      <td>{el.receiverAddress}</td>
                      <td>{el.hash}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Table;
