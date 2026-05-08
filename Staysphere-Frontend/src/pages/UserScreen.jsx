import { useContext, useEffect, useState } from "react";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { Failure } from "../components/Failure";
import { AuthContext } from "../components/AuthContext";
import API from "../services/api";

const UserScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token, handleUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatePassword, setUpdatePassword] = useState({});
  const [editProfile, setEditProfile] = useState({});

  const handleShowPassword = (user) => {
    setShowPassword(true);
    setSelectedUser(user);
  };

  const handleShowProfile = (user) => {
    setEditProfile({
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
    });
    setShowProfile(true);
    setSelectedUser(user);
  };

  const handleClose = () => {
    setShowPassword(false);
    setShowProfile(false);
    setUpdatePassword({});
    setEditProfile({});
  };

  const handlePasswordUpdate = (e) => {
    const { name, value } = e.target;
    setUpdatePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e) => {
    setEditProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileChange = async () => {
    const { phone, address, city, pincode } = editProfile;

    if (!selectedUser) {
      toast.error("Select user first");
      return;
    }

    if (!phone && !address && !city && !pincode) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await API.patch(
        `/users/edit/${selectedUser._id}`,
        editProfile,
      );

      if (res.status === 200) {
        Swal.fire("Success", "Profile Updated", "success");
      }
      fetchUser();
      handleClose();
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handlePasswordChange = async () => {
    const { password, c_password } = updatePassword;

    if (!selectedUser) {
      toast.error("Select user first");
      return;
    }

    if (password !== c_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await API.post(
        `/users/updatepassword/${selectedUser._id}`,
        updatePassword,
      );

      if (data.status === 200) {
        Swal.fire("Success", "Password Updated", "success");
      }

      handleClose();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (localStorage.getItem("guestUser")) {
      const guestUser = JSON.parse(localStorage.getItem("guestUser"));
      setUser(guestUser);
      handleUser(guestUser.name);
      return;
    }

    fetchUser();
  }, [token]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/verifyuser`);
      setUser(res.data);
      handleUser(res.data.name);
    } catch (error) {
      setError(true);
      toast.error("Session expired. Please login again. " + error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: "1",
      label: "Profile",
      children: (
        <MyProfile
          user={user}
          loading={loading}
          error={error}
          setShowPassword={setShowPassword}
          setShowProfile={setShowProfile}
          showPassword={showPassword}
          showProfile={showProfile}
          handleClose={handleClose}
          handlePasswordUpdate={handlePasswordUpdate}
          handleShowProfile={handleShowProfile}
          handleShowPassword={handleShowPassword}
          handlePasswordChange={handlePasswordChange}
          handleProfileChange={handleProfileChange}
          handleProfileUpdate={handleProfileUpdate}
          editProfile={editProfile}
        />
      ),
    },
    {
      key: "2",
      label: "Bookings",
      children: (
        <MyBookings
          user={user}
          setLoading={setLoading}
          loading={loading}
          setError={setError}
          error={error}
        />
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default UserScreen;

/* ---------------- PROFILE ---------------- */

export const MyProfile = ({
  user,
  loading,
  error,
  setShowPassword,
  showPassword,
  showProfile,
  setShowProfile,
  handleClose,
  handlePasswordUpdate,
  handleShowPassword,
  handleShowProfile,
  handlePasswordChange,
  handleProfileChange,
  handleProfileUpdate,
  editProfile,
}) => {
  return (
    <div className="container mt-4 d-flex justify-content-center">
      {loading ? (
        <Loader />
      ) : error ? (
        <Failure message={"Error loading profile"} />
      ) : !user ? (
        <div>
          <p className="fw-bolder fs-3 text-danger">Profile not found</p>
        </div>
      ) : (
        <>
          <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
            <h3 className="text-center mb-3">My Profile</h3>

            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>Email:</b> {user?.email}
            </p>
            <p>
              <b>Contact:</b> {user?.phone}
            </p>
            <p>
              <b>Address:</b> {user?.address}
            </p>
            <p>
              <b>City:</b> {user?.city}
            </p>
            <p>
              <b>Pincode:</b> {user?.pincode}
            </p>

            {localStorage.getItem("guestUser") ? (
              <p className="text-muted">Guest users cannot change password</p>
            ) : (
              <>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => handleShowProfile(user)}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => handleShowPassword(user)}
                >
                  Change Password
                </button>
              </>
            )}
          </div>

          {/* Profile Modal */}
          {showProfile && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Profile Details</h5>
                    <button
                      className="btn-close"
                      onClick={handleClose}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Contact</label>
                      <input
                        type="number"
                        className="form-control"
                        name="phone"
                        value={editProfile?.phone}
                        onChange={handleProfileUpdate}
                      />
                    </div>

                    <div>
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={editProfile?.address}
                        onChange={handleProfileUpdate}
                      />
                    </div>
                    <div>
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={editProfile?.city}
                        onChange={handleProfileUpdate}
                      />
                    </div>
                    <div>
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        name="pincode"
                        value={editProfile?.pincode}
                        onChange={handleProfileUpdate}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleClose}>
                      Cancel
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={handleProfileChange}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Modal */}
          {showPassword && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Change Password</h5>
                    <button
                      className="btn-close"
                      onClick={handleClose}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        onChange={handlePasswordUpdate}
                      />
                    </div>

                    <div>
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="c_password"
                        onChange={handlePasswordUpdate}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleClose}>
                      Cancel
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={handlePasswordChange}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Backdrop */}
          {showPassword ||
            (showProfile && <div className="modal-backdrop fade show"></div>)}
        </>
      )}
    </div>
  );
};

/* ---------------- BOOKINGS ---------------- */

export function MyBookings({ user, setLoading, loading, setError, error }) {
  const [bookings, setBookings] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  const getBookings = async () => {
    try {
      setLoading(true);
      const data = (
        await API.post(`/bookings/getbookingsbyuserid`, {
          userid: user?._id,
        })
      ).data;
      setBookings(data);
    } catch {
      setError(true);
      toast.error("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) getBookings();
  }, [user]);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      await API.post("/bookings/cancelbooking", {
        bookingid,
        roomid,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingid ? { ...b, status: "cancelled" } : b,
        ),
      );

      Swal.fire("Cancelled", "Booking cancelled", "success");
    } catch {
      setError(true);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-3">
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
          <table className="table table-bordered table-hover text-center align-middle shadow">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Room</th>
                <th>Booking ID</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.room}</td>
                  <td>{booking._id}</td>
                  <td>{booking.fromStartDate}</td>
                  <td>{booking.toEndDate}</td>
                  <td>₹{booking.totalAmount}</td>

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

                  {/* <td>
                    {booking.status !== "cancelled" ? (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          cancelBooking(booking._id, booking.roomid)
                        }
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td> */}
                  <td>
                    {booking.status !== "cancelled" &&
                    new Date() - new Date(booking.createdAt) <
                      60 * 60 * 1000 ? (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          cancelBooking(booking._id, booking.roomid)
                        }
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
