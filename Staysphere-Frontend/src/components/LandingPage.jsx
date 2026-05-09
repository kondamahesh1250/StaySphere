import { Link } from "react-router-dom";
import landingImage from "../assets/landing_page_img.avif";
const styles = {
  hero: {
    height: "100vh",
    backgroundImage:
      // "url(https://images.unsplash.com/photo-1506059612708-99d6c258160e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      `url(${landingImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};
const LandingPage = () => {
  return (
    <>
      {/* HERO SECTION */}
      <div
        className="bg-dark text-white d-flex justify-content-center align-items-center text-center py-5"
        style={styles.hero}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to StaySphere</h1>
          <p className="lead">Find your perfect stay at the best prices</p>
          <Link to="/homescreen" className="btn btn-warning btn-lg mt-3">
            Get Started
          </Link>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="container py-5" id="about">
        <h2 className="text-center mb-4">About Us</h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <p>
              StaySphere connects travelers with the best accommodations at the
              best prices. Our platform simplifies discovering, comparing, and
              booking hotels, resorts, and vacation rentals worldwide. Whether
              it's a business trip or vacation, we help you find the best
              options that fit your needs and budget.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="https://images.trvl-media.com/lodging/2000000/1700000/1695500/1695484/61d41195.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium"
              alt="about"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="bg-light py-5" id="services">
        <div className="container">
          <h2 className="text-center mb-5">Our Services</h2>
          <div className="row g-4">
            {[
              "Hotel & Accommodation Booking",
              "Real-Time Availability",
              "Exclusive Deals & Discounts",
              "Detailed Hotel Information",
              "Flexible Cancellation",
              "Loyalty Program",
              "24/7 Customer Support",
              "Payment Flexibility",
            ].map((title, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">
                      Explore top features designed to improve your booking
                      experience.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="container py-5" id="contact">
        <h2 className="text-center mb-4">Get in Touch</h2>
        <p className="text-center mb-5">
          We're here to help with bookings and support.
        </p>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <i className="fas fa-envelope fa-2x mb-3"></i>
                <h5>Email</h5>
                <p>support@staysphere.com</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <i className="fas fa-phone fa-2x mb-3"></i>
                <h5>Phone</h5>
                <p>+1-800-123-4567</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <i className="fas fa-map-marker-alt fa-2x mb-3"></i>
                <h5>Office</h5>
                <p>StaySphere HQ, Travel Lane</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <i className="fas fa-share-alt fa-2x mb-3"></i>
                <h5>Social</h5>
                <p className="d-flex justify-content-center gap-1">
                  <a href="#"><i class="fa-brands fa-facebook"></i>Facebook</a> <br />
                  <a href="#"><i class="fa-brands fa-square-twitter"></i>Twitter</a> <br />
                  <a href="#"><i class="fa-brands fa-instagram"></i>Instagram</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
