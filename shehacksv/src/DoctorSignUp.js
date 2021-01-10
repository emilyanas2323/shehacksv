import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed } from "./data.js";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { db } from "./firebaseConfig";

class DoctorSignUp extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("handle click");
    this.addNewDoctor();
  }

  addNewDoctor() {
    // Pick first doctor
    var newDocRef = db.collection("Doctors").doc();
    db.collection('Doctors').get().then(snap => {
      var docSize = snap.size // will return the collection size
    });

    newDocRef.set({
      _id: 4,
      doctorID: newDocRef.id,
      firstName: document.getElementById('docname').value,
      lastName: document.getElementById('doclastname').value,
      email: document.getElementById('docEmail').value,
      password: document.getElementById('docPassword').value,
      assignedPatients: [],
    }).catch(function (error) {
      console.log("Error writing to document:", error);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-6 col-sm-12">
            <div className="card o-hidden border-0 shadow-lg my-4">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">
                          Welcome Doctor!
                        </h1>
                      </div>

                      <form className="user">
                        <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="docname"
                            aria-describedby="emailHelp"
                            placeholder="First Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="doclastname"
                            aria-describedby="emailHelp"
                            placeholder="Last Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
                            id="docEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="docPassword"
                            placeholder="Password"
                          />
                        </div>

                        {/* <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="docID"
                            aria-describedby="emailHelp"
                            placeholder="Doctor ID"
                          />
                        </div> */}

                        <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label
                              className="custom-control-label"
                              for="customCheck"
                            >
                              Remember Me
                            </label>
                          </div>
                        </div>
                        <Link
                          to="/patientdashboard"
                          className="btn btn-primary btn-user btn-block"
                          onClick={this.handleClick}
                        >
                          Login
                        </Link>
                      </form>

                      <div className="text-center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DoctorSignUp;
