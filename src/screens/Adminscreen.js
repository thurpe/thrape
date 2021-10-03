import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { axios } from "axios";
import Loader from "./../components/Loader";
import Swal from "sweetalert2";

const { TabPane } = Tabs;

export default function Adminscreen() {
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h2 className="text-center" style={{ fontSize: "27px" }}>
        <strong>Admin Panel</strong>
      </h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms />
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <AddRoom />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      setLoading(true);
      const data = await axios.get("/api/bookings/getallbookings").data;
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-10">
        {loading && <Loader />}
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Booking ID</th>
              <th>User ID </th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromDate}</td>
                    <td>{booking.toDate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      setLoading(true);
      const data = await axios.get("/api/bookings/getallroom").data;
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }, []);

  return (
    <div className="row">
      <div className="col-md-10">
        {loading && <Loader />}
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Room ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent/Day</th>
              <th>Max Count</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {loading && <Loader />}
            {rooms.length &&
              rooms.map((room) => {
                return (
                  <tr>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>{room.rentperday}</td>
                    <td>{room.maxcount}</td>
                    <td>{room.phonenumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      setLoading(true);
      const data = await (await axios.get("/api/bookings/getallusers")).data;
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }, []);
  return (
    <div>
      <div className="col-md-12">
        <h1>Users</h1>
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {loading && <Loader />}
            {users &&
              users.map((user) => {
                return (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AddRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [rentperday, setRentPerDay] = useState();
  const [maxcount, setMaxCount] = useState();
  const [description, setDescription] = useState();
  const [phonenumber, setPhoneNumber] = useState();
  const [type, setType] = useState();
  const [imageurl1, setImageUrl1] = useState();
  const [imageurl2, setImageUrl2] = useState();
  const [imageurl3, setImageUrl3] = useState();

  async function addRoom() {
    const newroom = {
      name,
      rentperday,
      maxcount,
      description,
      phonenumber,
      type,
      imageurls: [imageurl1, imageurl2, imageurl3],
    };
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/rooms/addroom", newroom)
      ).data;
      setLoading(false);
      Swal.fire("Great", "Room added successfully!", "success").then(
        (result) => {
          window.location.href = "/home";
        }
      );
      console.log(result);
    } catch (error) {
      setError(true);
      setLoading(false);
      Swal.fire("Oops!", "There was an error adding new room", "error");
      console.log(error);
    }
  }

  return (
    <div className="row">
      <div className="col-md-5 mt-1">
        {loading && <Loader />}
        <input
          type="text"
          placeholder="room name"
          className="form-control"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="rent per day"
          className="form-control"
          value={rentperday}
          onChange={(e) => {
            setRentPerDay(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="max count"
          className="form-control"
          value={maxcount}
          onChange={(e) => {
            setMaxCount(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="description"
          className="form-control"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="phone number"
          className="form-control"
          value={phonenumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />
      </div>
      <div className="col-md-5 mt-1">
        <input
          type="text"
          placeholder="type"
          className="form-control"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Image URL 1"
          className="form-control"
          value={imageurl1}
          onChange={(e) => {
            setImageUrl1(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Image URL 2"
          className="form-control"
          value={imageurl2}
          onChange={(e) => {
            setImageUrl2(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Image URL 3"
          className="form-control"
          value={imageurl3}
          onChange={(e) => {
            setImageUrl3(e.target.value);
          }}
        />
        <div className="text-right">
          <button className="btn btn-dark mt-2" onClick={addRoom}>
            ADD ROOM
          </button>
        </div>
      </div>
    </div>
  );
}
