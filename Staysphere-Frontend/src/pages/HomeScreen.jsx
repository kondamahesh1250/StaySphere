import { useEffect, useState } from "react";
import moment from "moment";
import { DatePicker } from "antd";
import { AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";
import { Failure } from "../components/Failure";
import RoomPage from "../components/RoomPage";
import API from "../services/api";

const { RangePicker } = DatePicker;

const HomeScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [fromDate, setFromDate] = useState(
    localStorage.getItem("fromDate") || "",
  );
  const [toDate, setToDate] = useState(localStorage.getItem("toDate") || "");
  const [searchkey, setSearchKey] = useState(
    localStorage.getItem("searchkey") || "",
  );
  const [type, setType] = useState(localStorage.getItem("roomtype") || "all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await API.get("/rooms/getallrooms")).data;
        setRooms(data);
        setDuplicateRooms(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    let tempRooms = [...duplicateRooms];

    // Search
    if (searchkey) {
      tempRooms = tempRooms.filter((room) =>
        room.name.toLowerCase().includes(searchkey.toLowerCase()),
      );
    }

    // Type
    if (type !== "all") {
      tempRooms = tempRooms.filter(
        (room) => room.type.toLowerCase() === type.toLowerCase(),
      );
    }

    //  Date
    if (fromDate && toDate) {
      tempRooms = tempRooms.filter((room) => {
        return room.currentbookings.every((booking) => {
          const bookingStart = moment(booking.fromStartDate, "DD-MM-YYYY");
          const bookingEnd = moment(booking.toEndDate, "DD-MM-YYYY");

          return !(
            moment(fromDate, "DD-MM-YYYY").isBetween(
              bookingStart,
              bookingEnd,
              null,
              "[]",
            ) ||
            moment(toDate, "DD-MM-YYYY").isBetween(
              bookingStart,
              bookingEnd,
              null,
              "[]",
            ) ||
            bookingStart.isBetween(
              moment(fromDate, "DD-MM-YYYY"),
              moment(toDate, "DD-MM-YYYY"),
              null,
              "[]",
            ) ||
            bookingEnd.isBetween(
              moment(fromDate, "DD-MM-YYYY"),
              moment(toDate, "DD-MM-YYYY"),
              null,
              "[]",
            )
          );
        });
      });
    }

    setRooms(tempRooms);
  }, [searchkey, type, fromDate, toDate, duplicateRooms]);

  /* FILTER BY DATE */
  // function filterByDate(dates) {
  //   if (!dates || dates.length === 0) {
  //     setFromDate("");
  //     setToDate("");
  //     if (type !== "all") {
  //       const temp = duplicateRooms.filter(
  //         (room) => room.type.toLowerCase() === type.toLowerCase(),
  //       );
  //       setRooms(temp);
  //     } else {
  //       setRooms(duplicateRooms);
  //     }
  //     return;
  //   }

  //   const start = dates[0].format("DD-MM-YYYY");
  //   const end = dates[1].format("DD-MM-YYYY");

  //   setFromDate(start);
  //   setToDate(end);

  //   const filtered = rooms.filter((room) => {
  //     return room.currentbookings.every((booking) => {
  //       const bookingStart = moment(booking.fromStartDate, "DD-MM-YYYY");
  //       const bookingEnd = moment(booking.toEndDate, "DD-MM-YYYY");

  //       return !(
  //         moment(start, "DD-MM-YYYY").isBetween(
  //           bookingStart,
  //           bookingEnd,
  //           null,
  //           "[]",
  //         ) ||
  //         moment(end, "DD-MM-YYYY").isBetween(
  //           bookingStart,
  //           bookingEnd,
  //           null,
  //           "[]",
  //         )
  //       );
  //     });
  //   });

  //   setRooms(filtered);
  // }

  /* SEARCH */
  // function filterBySearch() {
  //   if (
  //     searchkey.trim() === "" &&
  //     fromDate === "" &&
  //     toDate === "" &&
  //     type === "all"
  //   ) {
  //     setRooms(duplicateRooms);
  //   } else {
  //     const temp = rooms.filter((room) =>
  //       room.name.toLowerCase().includes(searchkey.toLowerCase()),
  //     );
  //     setRooms(temp);
  //   }

  //   // const temp = rooms.filter((room) =>
  //   //   room.name.toLowerCase().includes(searchkey.toLowerCase()),
  //   // );
  //   // setRooms(temp);
  // }

  /* TYPE */
  // function filterByType(value) {
  //   setType(value);

  //   if (value === "all" && fromDate === "" && toDate === "") {
  //     setRooms(duplicateRooms);
  //   } else {
  //     const temp = rooms.filter(
  //       (room) => room.type.toLowerCase() === value.toLowerCase(),
  //     );
  //     setRooms(temp);
  //   }
  // }

  function filterByDate(dates) {
    if (!dates || dates.length === 0) {
      setFromDate("");
      setToDate("");
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
    } else {
      const start = dates[0].format("DD-MM-YYYY");
      const end = dates[1].format("DD-MM-YYYY");

      setFromDate(start);
      setToDate(end);

      localStorage.setItem("fromDate", start);
      localStorage.setItem("toDate", end);
    }
  }

  function filterBySearch(e) {
    setSearchKey(e.target.value);
    localStorage.setItem("searchkey", e.target.value);
  }

  function filterByType(value) {
    setType(value);
    localStorage.setItem("roomtype", value);
  }

  const disabledDate = (current) =>
    current && current < moment().startOf("day");

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSearchKey("");
    setType("all");
    localStorage.removeItem("fromDate");
    localStorage.removeItem("toDate");
    localStorage.removeItem("searchkey");
    localStorage.removeItem("roomtype");
  };
  return (
    <div className="container mt-4">
      {/* FILTER BAR */}
      <div className="card shadow p-3 mb-4 w-75 mx-auto">
        <div className="row g-3 align-items-center">
          {/* DATE */}
          <div className="col-md-3">
            <RangePicker
              format="DD-MM-YYYY"
              onChange={filterByDate}
              disabledDate={disabledDate}
              className="w-100"
              value={
                fromDate && toDate
                  ? [
                      moment(fromDate, "DD-MM-YYYY"),
                      moment(toDate, "DD-MM-YYYY"),
                    ]
                  : null
              }
            />
          </div>

          {/* SEARCH */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search rooms"
              value={searchkey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyUp={filterBySearch}
            />
          </div>

          {/* TYPE */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={type}
              onChange={(e) => filterByType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="delux">Delux</option>
              <option value="non-delux">Non-Delux</option>
              <option value="suite">Suite</option>
              <option value="executive">Executive</option>
              <option value="luxury villa">Luxury Villa</option>
              <option value="budget">Budget</option>
            </select>
          </div>

          {/* RESET */}
          <div className="col-md-3">
            <button className="btn btn-secondary ms-md-4" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ROOMS */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Failure message="No rooms found" />
      ) : rooms.length === 0 ? (
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <img
            src="https://static.thenounproject.com/png/4440902-200.png"
            alt="error in loading image"
            width={"15%"}
          />
          <p>No rooms found</p>
        </div>
      ) : (
        <div className="row">
          <AnimatePresence>
            {rooms.map((room) => (
              <div key={room._id} className="col-md-4 mb-4">
                <RoomPage room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
