import { useState } from "react";
import Swal from "sweetalert2";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting StaySphere.",
      confirmButtonColor: "#000",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="container py-5">
      {/* HERO */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">Contact Us</h1>
        <p className="text-muted fs-5 mt-3">
          Have questions or need assistance with your booking? We are here to
          help you anytime.
        </p>
      </div>

      <div className="row g-5 align-items-start">
        {/* CONTACT INFO */}
        <div className="col-lg-5">
          <div className="card shadow border-0 p-4 h-100">
            <h3 className="fw-bold mb-4">Get In Touch</h3>

            <div className="mb-4">
              <h5 className="fw-semibold">📍 Address</h5>
              <p className="text-muted mb-0">
                StaySphere Headquarters,
                <br />
                Hyderabad, Telangana, India
              </p>
            </div>

            <div className="mb-4">
              <h5 className="fw-semibold">📞 Phone</h5>
              <p className="text-muted mb-0">+91 98765 43210</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-semibold">✉️ Email</h5>
              <p className="text-muted mb-0">support@staysphere.com</p>
            </div>

            <div>
              <h5 className="fw-semibold">🕒 Working Hours</h5>
              <p className="text-muted mb-0">
                Monday - Sunday
                <br />
                24/7 Customer Support
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="col-lg-7">
          <div className="card shadow border-0 p-4">
            <h3 className="fw-bold mb-4">Send Us a Message</h3>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea
                    rows="6"
                    className="form-control"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-dark px-4 py-2">
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="mt-5">
        <div className="card shadow border-0 overflow-hidden">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.523141624785!2d78.474061!3d17.385044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c6f2b6d8a9%3A0x8fdb1a4e3d6f8d5f!2sHyderabad!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
