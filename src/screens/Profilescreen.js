/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Tag } from "antd";
import axios from "axios";
import Loader from "./../components/Loader";
import Swal from "sweetalert2";

const { TabPane } = Tabs;

export default function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>

          <h1>Name: {user.name}</h1>
          <h1>Email: {user.email}</h1>
          <h1>Admin: {user.isAdmin ? "Yes" : "No"}</h1>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();

  useEffect(async () => {
    // eslint-disable-next-line no-unused-vars
    try {
      setLoading(true);
      const data = await (
        await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        })
      ).data;
      setBookings(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/booking/cancelbooking", { bookingid, roomid })
      ).data;
      console.log(result);
      setLoading(false);
      Swal.fire("Your booking has been cancelled", "success").then((result) => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {bookings &&
            bookings.map((booking) => {
              return (
                <div className="m-3 bs">
                  <h1>{booking.room}</h1>
                  <h1>
                    <strong>Booking Number: </strong>
                    {booking._id}
                  </h1>
                  <h1>
                    <strong>Check In:</strong> {booking.fromDate}
                  </h1>
                  <h1>
                    <strong>Check Out:</strong> {booking.toDate}
                  </h1>
                  <h1>
                    <strong>Status:</strong>{" "}
                    {booking.status === "cancelled" ? (
                      <Tag color="red">CANCELLED</Tag>
                    ) : (
                      <Tag color="green">CONFIRMED</Tag>
                    )}
                  </h1>
                  <div className="text-right">
                    {booking.status !== "cancelled" && (
                      <button
                        className="btn btn-dark"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomid);
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
