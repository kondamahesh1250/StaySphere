import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import API from "../services/api";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import { Failure } from "../components/Failure";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const BookingScreen = () => {
  const navigate = useNavigate();
  const { id, fromDate, toDate } = useParams();
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const fromStartDate = moment(fromDate, "DD-MM-YYYY");
  const toEndDate = moment(toDate, "DD-MM-YYYY");
  const totalDays = moment.duration(toEndDate.diff(fromStartDate)).asDays() + 1;

  const stripe = useStripe();
  const elements = useElements();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // USER
        const guestUser = JSON.parse(localStorage.getItem("guestUser"));
        if (guestUser) {
          setUser(guestUser);
        } else if (token) {
          const res = await API.get("/users/verifyuser");
          setUser(res.data);
        }

        // ROOM
        const data = (await API.post("/rooms/getroombyid", { roomid: id }))
          .data;

        setRoom(data);
        setTotalAmount(totalDays * data.rentperday);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, token]);

  // async function onToken(token) {
  //   const bookingDetails = {
  //     rooms: room,
  //     userid: user?._id,
  //     fromStartDate,
  //     toEndDate,
  //     totalAmount,
  //     totalDays,
  //     token,
  //   };

  //   try {
  //     setLoading(true);
  //     const { data } = await API.post("/bookings/bookroom", bookingDetails);

  //     if (data) {
  //       Swal.fire("Success", "Room booked successfully", "success");
  //       navigate("/homescreen");
  //     }
  //   } catch {
  //     Swal.fire("Error", "Something went wrong", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function handlePayment() {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/bookings/bookroom", {
        room,
        userid: user?._id,
        fromStartDate: fromStartDate.format("DD-MM-YYYY"),
        toEndDate: toEndDate.format("DD-MM-YYYY"),
        totalAmount,
        totalDays,
        paymentMethodId: paymentMethod.id,
      });

      if (data) {
        Swal.fire("Success", "Payment successful", "success");
        setShowModal(false);
        localStorage.removeItem("fromDate");
        localStorage.removeItem("toDate");
        localStorage.removeItem("searchkey");
        localStorage.removeItem("roomtype");
        navigate("/homescreen");
      }
    } catch (err) {
      setError(true);
      Swal.fire("Error", "Payment failed", "error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;
  if (error) return <Failure message="Something went wrong" />;

  return (
    <div className="container mt-4">
      {room && (
        <div className="row">
          {/* LEFT - IMAGE */}
          <div className="col-md-6 mb-3">
            <div className="card shadow">
              <img
                src={room.imageurls[0]}
                className="card-img-top"
                alt={room.name}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h4>{room.name}</h4>
              </div>
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="col-md-6">
            <div className="card shadow p-3 mb-3">
              <h5>Booking Details</h5>
              <hr />

              <p>
                <b>Name:</b> {user?.name}
              </p>
              <p>
                <b>From:</b> {fromDate}
              </p>
              <p>
                <b>To:</b> {toDate}
              </p>
              <p>
                <b>Max Count:</b> {room.maxcount}
              </p>
            </div>

            <div className="card shadow p-3 mb-3">
              <h5>Amount</h5>
              <hr />

              <p>
                <b>Total Days:</b> {totalDays}
              </p>
              <p>
                <b>Rent / Day:</b> ₹{room.rentperday}
              </p>
              <p className="fs-5">
                <b>Total:</b> ₹{totalAmount}
              </p>
            </div>

            <div className="text-center">
              {/* <StripeCheckout
                amount={totalAmount * 100}
                token={onToken}
                currency="INR"
                stripeKey={api}
              >
                <button className="btn btn-success w-100">
                  Pay Now
                </button>
              </StripeCheckout> */}

              {/* <div className="text-center">
                <CardElement className="form-control p-2 mb-3" />

                <button
                  className="btn btn-success w-100"
                  onClick={handlePayment}
                  disabled={!stripe}
                >
                  Pay Now
                </button>
              </div> */}
              <button
                className="btn btn-success w-100"
                onClick={() => setShowModal(true)}
              >
                Pay Now
              </button>

              {showModal && (
                <div className="modal show fade d-block" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Enter Card Details</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowModal(false)}
                        ></button>
                      </div>

                      <div className="modal-body">
                        <CardElement className="form-control p-2" />
                      </div>

                      <div className="modal-footer">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>

                        <button
                          className="btn btn-success"
                          onClick={handlePayment}
                          disabled={!stripe}
                        >
                          Pay ₹{totalAmount}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showModal && <div className="modal-backdrop fade show"></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingScreen;
