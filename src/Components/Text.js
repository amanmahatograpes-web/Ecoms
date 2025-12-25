import React, { useEffect, useState } from "react";

function Text() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

 
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ")[1] || "",
          address: data.address.street,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <form className="p-4 border rounded shadow-sm bg-light">
            <h4 className="mb-4 text-center">User Form</h4>

            <div className="mb-3">
              <label className="form-label fw-bold">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Text;
