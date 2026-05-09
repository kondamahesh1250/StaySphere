import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const RoomPage = ({ room, fromDate, toDate }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleUser = () => {
    const guestUser = localStorage.getItem("guestUser");

    if (!token && !guestUser) {
      sessionStorage.setItem(
        "redirectAfterLogin",
        `/book/${room._id}/${fromDate}/${toDate}`,
      );

      toast.warning("Please login to book a room", { autoClose: 1500 });
      navigate("/login");
    } else {
      navigate(`/book/${room._id}/${fromDate}/${toDate}`);
    }
  };

  return (
    <motion.div
      className="card shadow h-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {/* IMAGE */}
      <img
        src={room.imageurls[0]}
        className="card-img-top"
        alt={room.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{room.name}</h5>

        <p className="text-muted small mb-2">
          {Object.keys(room.features)
            .filter((key) => room.features[key])
            .join(", ")}
        </p>

        <p className="mb-1 text-capitalize">
          <strong>Type:</strong> {room.type}
        </p>

        <p className="mb-1">
          <strong>Max:</strong> {room.maxcount}
        </p>

        <p className="mb-3">
          <strong>Phone:</strong> {room.phonenumber}
        </p>

        {/* BUTTONS */}
        <div className="mt-auto d-flex justify-content-between">
          {fromDate && toDate && (
            <button className="btn btn-success btn-sm" onClick={handleUser}>
              Book Now
            </button>
          )}

          <Link to={`/viewroom/${room._id}`}>
            <button className="btn btn-outline-primary btn-sm">View</button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomPage;
