import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed } from "./data.js";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { db } from "./firebaseConfig";

var newDocRef = db.collection("Patients").doc();
var newDoc_doctors = db.collection("Doctors");

class PatientSignUp extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      newPatientID: 0,
    };
  }
   
  componentDidMount () {
    this.setState ({
      newPatientID: newDocRef.id,
    });
  }

  handleClick() {
    console.log("handle click");
    this.addNewPatient();
  }

  addNewPatient() {
    var doctorID = newDoc_doctors
    .orderBy('doctorID','asc')
    .limit(1)
    .get().doctorID;

    newDocRef.set({
      patientID: newDocRef.id,
      firstName: document.getElementById('patientname').value,
      lastName: document.getElementById('patientlastname').value,
      email: document.getElementById('patientEmail').value,
      password: document.getElementById('patientPassword').value,
      healthCard: document.getElementById('patienthealthCard').value,
      DOB: new Date(document.getElementById('patientDOB').value),
      gender: document.getElementById('patientGender').value,
      doctorID: doctorID,
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
                          Welcome Patient!
                        </h1>
                      </div>

                      <form className="user">
                        <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="patientname"
                            aria-describedby="emailHelp"
                            placeholder="First Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="patientlastname"
                            aria-describedby="emailHelp"
                            placeholder="Last Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
                            id="patientEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="patientPassword"
                            placeholder="Password"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="date"
                            className="form-control form-control-user"
                            id="patientDOB"
                            aria-describedby="emailHelp"
                            placeholder="Birthdate Day/Month/Year (00/00/0000)"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="patienthealthCard"
                            aria-describedby="emailHelp"
                            placeholder="Health Card Number"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="txt"
                            className="form-control form-control-user"
                            id="patientGender"
                            aria-describedby="emailHelp"
                            placeholder="Gender: male / female"
                          />
                        </div>
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
                          to={{
                            pathname: "/patientdashboard",
                            data: this.state.newPatientID,
                          }}
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

export default PatientSignUp;
