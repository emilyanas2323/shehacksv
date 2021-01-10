import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed } from "./data.js";
import "./SignUp.css";
import "./DoctorDashboard.css";
import { Link } from "react-router-dom";
import { BsFillCalendarFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { FiDollarSign } from "react-icons/fi";
import { FiUserCheck } from "react-icons/fi";
import { FiBook } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import Chart from 'chart.js';
import { db } from "./firebaseConfig";

class DoctorDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.getPatientInfo = this.getPatientInfo.bind(this);

    this.state = {
      patientIds: [],
      firstName: "",
      lastName: "",
      moods: [],
      diagnoses: [],
      specialisations: []
    };
  }

  initializeChart() {
    console.log(this.state.moods)
    new Chart(document.getElementById("myChart"), {
      type: 'line',
      data: {
        labels: ["Mon","Tue","Wed","Thu"],
        datasets: [{ 
            data: this.state.moods,
            // data: [2,4,3,5]
            label: "Patient's Reported Mood",
            borderColor: "#8e5ea2",
            fill: false
          }
        ]
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    });  
  }

  getPatientInfo() {
    var docRef = db.collection("Doctors").doc("2TEZiTy2YZf4lcDwCski");
    let patients = [];
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data().assignedPatients);
          patients = this.state.patientIds;
          for(let i = 0; i<doc.data().assignedPatients.length; i++) {
            patients.push(doc.data().assignedPatients[i]);
          }
          let patient = patients[0];
            var docRef = db.collection("Patients").doc(patient);
            docRef
              .get()
              .then((doc) => {
                if (doc.exists) {
                  //console.log("Document data:", doc.data());
                  this.setState({
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName
                  });
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch(function (error) {
                console.log("Error getting document:", error);
              });

            let patientMood = this.state.moods;
            docRef = db.collection("Patients").doc(patient).collection("DailyEntries");
            docRef
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      console.log(doc.id, " => ", doc.data().Mood);
                      patientMood.push(parseInt(doc.data().Mood));
                  });
                  this.setState({
                    moods: patientMood    
                  })
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });

            let patientDiag = this.state.diagnoses;
            docRef = db.collection("Patients").doc(patient).collection("PossibleDiagnosis");
            docRef
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      patientDiag.push(doc.data().DiagID);
                  });
                  this.setState({
                    moods: patientDiag    
                  })
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });

            let patientSpec = this.state.specialisations;
            docRef = db.collection("Patients").doc(patient).collection("PossibleSpecializations");
            docRef
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      patientSpec.push(doc.data().name);
                  });
                  this.setState({
                    moods: patientSpec    
                  })
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });    

      console.log(this.state.moods)
      console.log(this.state.diagnoses)
      console.log(this.state.specialisations)
  }

  componentDidMount() {
      this.getPatientInfo();
      this.initializeChart();
  }

  render() {
    return (
      <div id="wrapper">
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <a
            className="sidebar-brand d-flex align-items-center justify-content-center"
            href="index.html"
          >
            <div className="sidebar-brand-icon rotate-n-15">
              <i className="fas fa-laugh-wink"></i>
            </div>
            <div className="sidebar-brand-text mx-3">
              Dr. Scott<sup></sup>
            </div>
          </a>

          <div className="sidebar-heading">Patients</div>

          <hr className="sidebar-divider mb-0" />

          <li className="nav-item active">
            <a className="nav-link" href="">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>{this.state.firstName + " " + this.state.lastName}</span>
            </a>
          </li>

          <hr className="sidebar-divider my-0" />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
            >
              <span>John Doe</span>
            </a>
          </li>

          <hr className="sidebar-divider my-0" />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
            >
              <span>Jane Doe</span>
            </a>
          </li>

          <hr className="sidebar-divider my-0" />
        </ul>

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>

              <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                {/* <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 small"
                    placeholder="Search for..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div> */}
              </form>

              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow d-sm-none">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="searchDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-search fa-fw"></i>
                  </a>

                  <div
                    className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                    aria-labelledby="searchDropdown"
                  >
                    <form className="form-inline mr-auto w-100 navbar-search">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control bg-light border-0 small"
                          placeholder="Search for..."
                          aria-label="Search"
                          aria-describedby="basic-addon2"
                        />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </li>

                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                      Micheal Scott
                    </span>
                    <IconContext.Provider
                            value={{
                              className: "icon-class",
                            }}
                          >
                            <FiUserCheck />
                          </IconContext.Provider>
                  </a>

                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </a>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                      Settings
                    </a>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                      Activity Log
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
            </nav>

            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Jim Halpert</h1>
                <a
                  href="#"
                  className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                >
                   <IconContext.Provider
                            value={{
                             
                            }}
                          >
                            <FiDownload />
                          </IconContext.Provider> Generate
                  Report
                </a>
              </div>

              <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Next Appointment
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            23 Jan 2021
                          </div>
                        </div>
                        <div className="col-auto">
                          <IconContext.Provider
                            value={{
                              className: "icon-class",
                            }}
                          >
                            <BsFillCalendarFill />
                          </IconContext.Provider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Insurance Coverage
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            $2245.00
                          </div>
                        </div>
                        <div className="col-auto">
                        <IconContext.Provider
                            value={{
                              className: "icon-class",
                            }}
                          >
                            <FiDollarSign />
                          </IconContext.Provider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Recovery Progress
                          </div>
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto">
                              <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                54%
                              </div>
                            </div>
                            <div className="col">
                              <div className="progress progress-sm mr-2">
                                <div
                                  className="progress-bar bg-info"
                                  role="progressbar"
                                  aria-valuenow="50"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-auto">
                        <IconContext.Provider
                            value={{
                              className: "icon-class",
                            }}
                          >
                            <FiBook />
                          </IconContext.Provider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Alert(s)
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            3
                          </div>
                        </div>
                        <div className="col-auto">
                        <IconContext.Provider
                            value={{
                              className: "icon-class",
                            }}
                          >
                            <FiBell />
                          </IconContext.Provider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-8 col-lg-7">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">
                        Overall Health Status
                      </h6>
                    </div>

                    <div className="card-body">
                      <div className="chart-area">
                        <canvas id="myChart" height="150" width="400"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column col-xl-4 col-lg-5">
                <div className="">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">Potential Diagnoses</h6>
                      <div className="dropdown no-arrow">
                        <a
                          className="dropdown-toggle"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div
                          className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <div className="dropdown-header">Dropdown Header:</div>
                          <a className="dropdown-item" href="#">
                            Action
                          </a>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <p>Diagnosis 1: {this.state.diagnoses[0]}</p>
                      <hr />
                      <p>Diagnosis 2: {this.state.diagnoses[1]}</p>
                      <a
                        target="_blank"
                        rel="nofollow"
                        href=""
                      >
                        See More
                      </a>
                    </div>
                  </div>
                </div>

              
                <div className="">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">Potential Specialisations</h6>
                      <div className="dropdown no-arrow">
                        <a
                          className="dropdown-toggle"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div
                          className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <div className="dropdown-header">Dropdown Header:</div>
                          <a className="dropdown-item" href="#">
                            Action
                          </a>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <p>Specialisation 1: {this.state.specialisations[0]}</p>
                      <hr />
                      <p>Specialisation 2: {this.state.specialisations[1]}</p>
                      <a
                        target="_blank"
                        rel="nofollow"
                        href=""
                      >
                        See More
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className="row">
              <div class="col-xl-4 col-lg-5">
                  <div class="card shadow mb-4">
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 class="m-0 font-weight-bold text-primary">
                        Doctor's Notes
                      </h6>
                      <div class="dropdown no-arrow">
                        <a
                          class="dropdown-toggle"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div
                          class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <div class="dropdown-header">Dropdown Header:</div>
                          <a class="dropdown-item" href="#">
                            Action
                          </a>
                          <a class="dropdown-item" href="#">
                            Another action
                          </a>
                          <div class="dropdown-divider"></div>
                          <a class="dropdown-item" href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="card-body">
                    
                    <div class="form-group">
    <label for="exampleFormControlTextarea1">Example textarea</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
  </div>
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

export default DoctorDashboard;
