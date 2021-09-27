import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./../components/Loader";
import Error from "./../components/Error";

function Bookingscreen({ match }) {
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(true);
  const [setError] = useState();

  useEffect(async () => {
    try {
      setLoading(true);
      const data = (
        await axios.post("/api/rooms/getroombyid", {
          roomid: match.params.roomid,
        })
      ).data;
      setRoom(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }, []);

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : room ? (
        <div className="shadow-lg p-4 mb-4 bg-body rounded">
          <div className="row">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} alt="" className="bigImg" />
            </div>
            <div className="col-md-6 mx-auto">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <p>Name: </p>
                <p>From Date:</p>
                <p>To Date:</p>
                <p>Max Count: {room.maxcount}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />
                <p>Total Days:</p>
                <p>Rent Per Day {room.rentperday}</p>
                <p>Total Amount</p>
              </div>
              <div style={{ float: "right" }}>
                <button className="btn btn-dark">Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
