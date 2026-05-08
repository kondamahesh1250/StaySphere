import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Loader from "../components/Loader";
import { Failure } from "../components/Failure";
import API from "../services/api";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RoomDetails = () => {
  const { id } = useParams();

  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState([12.9716, 77.5946]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await API.post(`/rooms/getroombyid`, { roomid: id }))
          .data;
        setRooms(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchRooms();
  }, [id]);

  useEffect(() => {
    if (rooms?.location?.lat && rooms?.location?.lng) {
      setPosition([rooms.location.lat, rooms.location.lng]);
    }
  }, [rooms]);

  if (error) return <Failure message="Error fetching data!" />;

  return (
    <div className="container my-4 pb-4">
      {loading && <Loader />}

      {!loading && rooms && (
        <>
          <h2 className="fw-bold mb-4 text-start">Room Details</h2>

          {/* Carousel */}
          <div
            id="roomCarousel"
            className="carousel slide mb-4"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner rounded shadow">
              {rooms?.imageurls?.map((img, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={img}
                    className="d-block w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                    alt=""
                  />
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#roomCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon"></span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#roomCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>

          {/* Details + Map */}
          <div className="row">
            {/* Left */}
            <div className="col-md-6">
              <div className="card shadow p-3 mb-3">
                <h4 className="fw-bold">{rooms?.name}</h4>
                <p>{rooms?.description}</p>

                <p>
                  <b>Type:</b> {rooms?.type}
                </p>
                <p>
                  <b>Price:</b> ₹{rooms?.rentperday}
                </p>

                <h5 className="mt-3">Facilities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {rooms?.features && Object.keys(rooms.features).length > 0 ? (
                    Object.keys(rooms.features)
                      .filter((key) => rooms.features[key])
                      .map((key) => (
                        <span key={key} className="badge bg-secondary p-2">
                          {key.replace(/_/g, " ")}
                        </span>
                      ))
                  ) : (
                    <span>No features available</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-md-6">
              <div className="card shadow p-3">
                <h5 className="fw-bold mb-3">Location</h5>
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={customIcon}>
                    <Popup>Hotel Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomDetails;
