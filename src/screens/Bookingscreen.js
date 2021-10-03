import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./../components/Loader";
import Error from "./../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 1000,
});

function Bookingscreen({ match }) {
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  const [totalAmount, setTotalAmount] = useState();

  const fromDate = moment(match.params.fromDate, "DD-MM-YY");
  const toDate = moment(match.params.toDate, "DD-MM-YY");

  const totalDays = moment.duration(toDate.diff(fromDate)).asDays() + 1;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (!localStorage.getItem("currentUser")) {
      window.location.reload = "/login";
    }
    try {
      setLoading(true);
      const data = (
        await axios.post("/api/rooms/getroombyid", {
          roomid: match.params.roomid,
        })
      ).data;
      setTotalAmount(data.rentperday * totalDays);
      setRoom(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onToken(token) {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromDate,
      toDate,
      totalDays,
      totalAmount,
      token,
    };
    try {
      setLoading(true);
      await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "All good!",
        "Your room was booked successfully",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Oh no!", "Something went wrong", "error");
    }
  }

  return (
    <div className="m-5" data-aos="flip-left">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : room ? (
        <div className="shadow-lg p-4 mb-4 bg-body rounded">
          <div className="row">
            <div className="col-md-7">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} alt="" className="bigImg" />
            </div>
            <div className="col-md-5 mx-auto">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Summary</h1>
                <hr />
                <p>
                  <strong>Name:</strong>{" "}
                  {JSON.parse(localStorage.getItem("currentUser")).name}{" "}
                </p>
                <p>
                  <strong>From Date:</strong> {match.params.fromDate}
                </p>
                <p>
                  <strong>To Date:</strong> {match.params.toDate}
                </p>
                <p>
                  <strong>Max Count:</strong> {room.maxcount}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />
                <p>Total Days: {totalDays}</p>
                <p>Rent Per Day: {room.rentperday}</p>
                <p>Total Amount: {totalAmount}</p>
              </div>
              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalAmount * 100}
                  currency="INR"
                  token={onToken}
                  stripeKey="pk_test_51JYvLNCOUZhrfRQLblj7yuMDqqGpm5UOTOHSZ8P5eM2p69HSpWqkVyKYsYrgbLOB7hXvO3n96XyUEgJJpIF9I44m00MIwRNxQI"
                >
                  <button className="btn btn-dark">Pay Now</button>
                </StripeCheckout>
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
