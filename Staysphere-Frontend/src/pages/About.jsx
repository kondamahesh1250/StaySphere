import aboutImage from "../assets/about_img.avif";

export default function About() {
  return (
    <div className="container py-5">
      {/* HERO SECTION */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">About StaySphere</h1>
        <p className="text-muted fs-5 mt-3">
          StaySphere is a modern hotel and room booking platform designed to
          provide a smooth, secure, and hassle-free reservation experience.
        </p>
      </div>

      {/* ABOUT CONTENT */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-lg-6">
          <img
            // src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
            src={aboutImage}
            alt="Hotel"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">Who We Are</h2>
          <p className="text-muted">
            StaySphere helps users discover, explore, and book premium hotel
            rooms with ease. Whether you are planning a vacation, business trip,
            or weekend getaway, our platform offers a seamless booking
            experience with secure online payments and instant confirmations.
          </p>

          <p className="text-muted">
            Our mission is to simplify hotel reservations by combining modern
            technology, user-friendly design, and reliable booking services in
            one platform.
          </p>

          <div className="mt-4">
            <div className="d-flex align-items-center mb-3">
              <div
                className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                style={{ width: "45px", height: "45px" }}
              >
                ✓
              </div>
              <span>Secure Online Payments</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div
                className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                style={{ width: "45px", height: "45px" }}
              >
                ✓
              </div>
              <span>Real-Time Room Availability</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div
                className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                style={{ width: "45px", height: "45px" }}
              >
                ✓
              </div>
              <span>Fast & Easy Booking Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="row text-center g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow border-0 h-100 p-4">
            <h3 className="fw-bold mb-3">Luxury Rooms</h3>
            <p className="text-muted">
              Explore premium and comfortable rooms with modern facilities.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 h-100 p-4">
            <h3 className="fw-bold mb-3">Instant Booking</h3>
            <p className="text-muted">
              Book rooms instantly with secure online payment integration.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 h-100 p-4">
            <h3 className="fw-bold mb-3">24/7 Support</h3>
            <p className="text-muted">
              Our support team is always available to help travelers anytime.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-dark text-white rounded p-5 text-center">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h2 className="fw-bold">500+</h2>
            <p>Rooms Available</p>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <h2 className="fw-bold">1000+</h2>
            <p>Happy Customers</p>
          </div>

          <div className="col-md-4">
            <h2 className="fw-bold">24/7</h2>
            <p>Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
