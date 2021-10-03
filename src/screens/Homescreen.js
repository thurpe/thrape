import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "./../components/Loader";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";

function Homescreen() {
  const { RangePicker } = DatePicker;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [duplicateRooms, setDuplicateRooms] = useState([]);

  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      setLoading(true);
      const data = (await axios.get("/api/rooms/all")).data;
      setRooms(data);
      setDuplicateRooms(data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, []);

  function filterBySearch() {
    const temprooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchKey.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterByType(e) {
    setType(e);
    if (e !== "all") {
      const temprooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(temprooms);
    } else {
      setRooms(duplicateRooms);
    }
  }

  //Doesn't hide dates that have already been booked for now
  function filterByDate(dates) {
    setFromDate(moment(dates[0]).format("DD-MM-YYYY"));
    setToDate(moment(dates[1]).format("DD-MM-YYYY"));

    var temprooms = [];
    for (const room of duplicateRooms) {
      var availability = false;
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (
            !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
              booking.fromDate,
              booking.toDate
            ) &&
            !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
              booking.fromDate,
              booking.toDate
            )
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== booking.fromDate &&
              moment(dates[0]).format("DD-MM-YYYY") !== booking.toDate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.fromDate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.toDate
            ) {
              availability = true;
            }
          }
        }
      }
      // eslint-disable-next-line eqeqeq
      if (availability == true || room.currentbookings.length == 0) {
        temprooms.push(room);
      }
      setRooms(temprooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Find a room"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="delux">Deluxe</option>
            <option value="non-delux">Basic</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => {
            return (
              <div className="col-md-11 mt-2">
                <Room room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Homescreen;
