import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Tabs, ConfigProvider } from "antd";
import { Failure } from "../components/Failure";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { AuthContext } from "../components/AuthContext";
import API from "../services/api";

const AdminScreen = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const items = [
    { key: "1", label: "Bookings", children: <Bookings /> },
    { key: "2", label: "Rooms", children: <Rooms /> },
    { key: "3", label: "Users", children: <Users /> },
    { key: "4", label: "Add Room", children: <AddRoom /> },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Panel</h2>

      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default AdminScreen;

/* ================= BOOKINGS ================= */
export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = (await API.get("/bookings/getallbookings")).data;
        setBookings(data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container mt-3">
      {/* <h3 className="text-left mb-4">Bookings Details</h3> */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Failure
          message={"Sorry , we are unable to fetch bookings at this time."}
        />
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <img
            src="https://static.thenounproject.com/png/4440902-200.png"
            alt="error in loading image"
            width={"15%"}
          />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>User ID</th>
                <th>Room</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 &&
                bookings.map((booking, index) => (
                  <tr key={booking?._id}>
                    <td>{index + 1}</td>
                    <td>{booking?.userid}</td>
                    <td>{booking?.room}</td>
                    <td>{booking?.fromStartDate}</td>
                    <td>{booking?.toEndDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          booking.status === "cancelled"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================= ROOMS ================= */
export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [show, setShow] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [showDelete, setShowDelete] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/rooms/getallrooms");
      setRooms(data);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleClose = () => {
    setShow(false);
    setUpdatedData({});
  };
  const handleShow = (room) => {
    setSelectedRoom(room);
    setUpdatedData(room);
    setShow(true);
  };

  const handleShowDelete = (room) => {
    setSelectedRoom(room);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSave = async () => {
    if (!selectedRoom) {
      toast.error("Please select a room to update");
      return;
    }

    try {
      const { data } = await API.put(
        `/rooms/update/${selectedRoom._id}`,
        updatedData,
      );
      if (data) {
        Swal.fire("Success!", "Room details updated successfully", "success");
        fetchRooms();
      } else {
        Swal.fire("Oops", "Update Failed!", "error");
      }
      handleClose();
    } catch (error) {
      console.log(error);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedRoom) {
      toast.error("Please select a room to delete!");
      return;
    }
    const roomid = selectedRoom._id;
    try {
      const { data } = await API.delete(`/rooms/delete/${roomid}`);
      if (data) {
        Swal.fire("Success!", "Room deleted successfully", "success");
        fetchRooms();
      } else {
        Swal.fire("Oops", "Delete Failed!", "error");
      }
      handleCloseDelete();
    } catch (error) {
      console.log(error);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  };

  return (
    <div className="container mt-3">
      {/* <h3 className="text-left mb-4">Rooms Details</h3> */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Failure
          message={"Sorry , we are unable to fetch rooms at this time."}
        />
      ) : rooms.length === 0 ? (
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <img
            src="https://static.thenounproject.com/png/4440902-200.png"
            alt="errlr in loading image"
            width={"15%"}
          />
          <p>No rooms found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                {/* <th>Room ID</th> */}
                <th>S.No</th>
                <th>Name</th>
                <th>Type</th>
                <th>Rent Per Day</th>
                <th>Max</th>
                <th>Phone</th>
                <th colSpan={"2"}>Action</th>
              </tr>
            </thead>

            <tbody>
              {rooms &&
                rooms.map((room, index) => (
                  <tr key={room?._id}>
                    <td>{index + 1}</td>
                    <td>{room?.name}</td>
                    <td>{room?.type}</td>
                    <td>{room?.rentperday}</td>
                    <td>{room?.maxcount}</td>
                    <td>{room?.phonenumber}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleShow(room)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowDelete(room)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Delete Room Modal */}
          {/* <Modal show={showDelete} onHide={handleCloseDelete} centered>
              <Modal.Header>
                <Modal.Title>Delete Room</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedRoom && <p>Are you sure want to remove the room!!</p>}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal> */}

          {showDelete && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delete Room</h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseDelete}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p>Are you sure want to remove the room?</p>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={handleCloseDelete}
                    >
                      Cancel
                    </button>

                    <button className="btn btn-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modify Room Modal */}
          {/* <Modal show={show} onHide={handleClose} centered>
              <Modal.Header>
                <Modal.Title>Modify Room Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedRoom && (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Room Name</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="name"
                        value={updatedData?.name || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="type"
                        value={updatedData?.type || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rent Per Day</label>
                      <input
                        type="number"
                        className="form-control mb-2"
                        name="rentperday"
                        value={updatedData?.rentperday || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Max Count</label>
                      <input
                        type="number"
                        className="form-control mb-2"
                        name="maxcount"
                        value={updatedData?.maxcount || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="number"
                        className="form-control mb-2"
                        name="phonenumber"
                        value={updatedData?.phonenumber || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal> */}

          {show && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Modify Room Details</h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleClose}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {selectedRoom && (
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Room Name</label>

                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={updatedData?.name || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Type</label>

                          <input
                            type="text"
                            className="form-control"
                            name="type"
                            value={updatedData?.type || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Rent Per Day</label>

                          <input
                            type="number"
                            className="form-control"
                            name="rentperday"
                            value={updatedData?.rentperday || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Max Count</label>

                          <input
                            type="number"
                            className="form-control"
                            name="maxcount"
                            value={updatedData?.maxcount || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Phone</label>

                          <input
                            type="number"
                            className="form-control"
                            name="phonenumber"
                            value={updatedData?.phonenumber || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleClose}>
                      Cancel
                    </button>

                    <button className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= USERS ================= */
export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = (await API.get(`/users/getallusers`)).data;
      const filteredUsers = data.filter((user) => user.isAdmin === false);
      setUsers(filteredUsers);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShowDelete = (id) => {
    setSelectedUser(id);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      toast.error("please select user");
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.delete(`/users/delete/${selectedUser}`);
      setLoading(false);
      if (data) {
        Swal.fire("Success!", "User removed successfully", "success");
        fetchUsers();
      } else {
        Swal.fire("Oops", "Delete Failed!", "error");
      }
      handleCloseDelete();
    } catch (error) {
      console.log(error);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  };

  return (
    <div className="container mt-3">
      {/* <h3 className="text-left mb-4">Users Details</h3> */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Failure
          message={"Sorry , we are unable to fetch users at this time."}
        />
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <img
            src="https://static.thenounproject.com/png/4440902-200.png"
            alt="error in loading image"
            width={"15%"}
          />
          <p>No users found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                {/* <th>isAdmin</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => (
                  <tr key={user?._id}>
                    {/* <td>{user?._id}</td> */}
                    <td>{index + 1}</td>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    {/* <td>{user?.isAdmin ? "YES" : "NO"}</td> */}
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowDelete(user?._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Delete User Modal */}
          {/* <Modal show={showDelete} onHide={handleCloseDelete} centered>
              <Modal.Header>
                <Modal.Title>Delete User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedUser && <p>Are you sure want to remove the user!!</p>}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal> */}
          {showDelete && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Delete User</h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseDelete}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p>Are you sure want to remove the user?</p>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={handleCloseDelete}
                    >
                      Cancel
                    </button>

                    <button className="btn btn-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= ADD ROOM ================= */
export const AddRoom = () => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rentperday, setRentPerDay] = useState("");
  const [maxcount, setMaxCount] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [type, setType] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [features, setFeatures] = useState({
    Wifi: false,
    Ac: false,
    Tv: false,
    Parking: false,
    "Lake View": false,
    Balcony: false,
    "Safe Deposit Box": false,
    "Work Desk": false,
  });

  const handleFeatureChange = (event) => {
    const { name, checked } = event.target;
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [name]: checked,
    }));
  };

  async function addRoom(e) {
    e.preventDefault();

    const newRoom = {
      name,
      description,
      rentperday,
      maxcount,
      phonenumber,
      type,
      imageurls: [imageUrl1, imageUrl2, imageUrl3],
      features,
      location: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      },
    };

    try {
      setLoading(true);
      const { data } = await API.post(`/rooms/addroom`, newRoom);

      if (data) {
        Swal.fire("Success!", "Room added successfully", "success");
        setName("");
        setDescription("");
        setRentPerDay("");
        setMaxCount("");
        setPhoneNumber("");
        setType("");
        setImageUrl1("");
        setImageUrl2("");
        setImageUrl3("");
        setFeatures({});
        setLatitude(null);
        setLongitude(null);
      } else {
        Swal.fire("Oops", "Delete Failed!", "error");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to add room", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-3">
      {/* <h3>Add Room</h3> */}
      {loading && <Loader />}

      <form onSubmit={addRoom}>
        <div className="row">
          {/* LEFT */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Room Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rent Per Day</label>
              <input
                className="form-control"
                value={rentperday}
                onChange={(e) => setRentPerDay(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Max Count</label>
              <input
                className="form-control"
                value={maxcount}
                onChange={(e) => setMaxCount(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Type</label>
              <input
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Image 1</label>
              <input
                className="form-control"
                value={imageUrl1}
                onChange={(e) => setImageUrl1(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image 2</label>
              <input
                className="form-control"
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image 3</label>
              <input
                className="form-control"
                value={imageUrl3}
                onChange={(e) => setImageUrl3(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Latitude</label>
                <input
                  className="form-control"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Longitude</label>
                <input
                  className="form-control"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* FEATURES */}
            <div className="mb-3">
              <label className="form-label">Features</label>
              <div className="row">
                {Object.keys(features).map((key) => (
                  <div key={key} className="col-6 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={key}
                      checked={features[key]}
                      onChange={handleFeatureChange}
                    />
                    <label className="form-check-label">{key}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="addroombtn"> */}
            <button type="submit" className="btn btn-success w-100">
              Add Room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
