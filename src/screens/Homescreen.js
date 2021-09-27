import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "./../components/Loader";
import Error from "./../components/Error";

function Homescreen() {
  const [rooms, setRoom] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  useEffect(async () => {
    try {
      setLoading(true);
      const data = (await axios.get("/api/rooms/all")).data;
      setRoom(data);
      setLoading(false);
    } catch (error) {
      setError(true);
      console.log(error);
      setLoading(false);
    }
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length > 1 ? (
          rooms.map((room) => {
            return (
              <div className="col-md-11 mt-2">
                <Room room={room} />
              </div>
            );
          })
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
