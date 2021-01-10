import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed, diagnosesspecials } from "./data.js";
import { db } from "./firebaseConfig";
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
import { FaBookMedical } from "react-icons/fa";

class PatientDashboard1 extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onSelectIssue = this.onSelectIssue.bind(this);
    this.onRemoveIssue = this.onRemoveIssue.bind(this);
    this.onProposedSelect = this.onProposedSelect.bind(this);
    this.onProposedRemove = this.onProposedRemove.bind(this);
    this.onProposedSelectIssue = this.onProposedSelectIssue.bind(this);
    this.onProposedRemoveIssue = this.onProposedRemoveIssue.bind(this);
    this.additionalSymptoms = this.additionalSymptoms.bind(this);
    this.additionalIssues = this.additionalIssues.bind(this);
    this.updateProposedSymptoms = this.updateProposedSymptoms.bind(this);
    this.submitSymptoms = this.submitSymptoms.bind(this);
    this.updateInfoIssues = this.updateInfoIssues.bind(this);

    this.state = {
      issueid: 0,
      options: [],
      optionsIssues: [],
      selectedSymptoms: [],
      proposedSymptoms: [],
      selectedIssues: [],
      proposedIssues: [],
      selectedProposedSymptoms: [],
      firstName: "",
      lastName: "",
      DOB: new Date(),
      gender: "",
    };
  }

  componentDidMount() {
    console.log(this.props.location.data);
    const options = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms",
      params: { language: "en-gb", format: "json" },
      headers: {
        "x-rapidapi-key": "a4dc6a92bemshd411cecf19a1136p197d8ejsnace6d7bd4d5e",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    const optionsIssues = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/issues",
      params: { language: "en-gb", format: "json" },
      headers: {
        "x-rapidapi-key": "a4dc6a92bemshd411cecf19a1136p197d8ejsnace6d7bd4d5e",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    //axios request ISSUES
    axios
      .request(optionsIssues)
      .then((response) => {
        console.log(response.data);
        this.setState({
          optionsIssues: response.data,
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    //axios request
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        this.setState({
          options: response.data,
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    // using sample data
    this.setState({
      options: res,
    });

    var docRef = db.collection("Patients").doc(this.props.location.data);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.setState({
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            DOB: doc.data().DOB.toDate(),
            gender: doc.data().gender,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  updateProposedSymptoms(selectedSymptoms) {
    let symptoms = "[";
    selectedSymptoms.forEach((item) => {
      symptoms += item.ID + ",";
    });
    symptoms = symptoms.substring(0, symptoms.length - 1) + "]";
    console.log(symptoms);
    const options = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms/proposed",
      params: {
        gender: this.state.gender,
        year_of_birth: new Date(this.state.DOB).getFullYear(),
        language: "en-gb",
        symptoms: symptoms,
      },
      headers: {
        "x-rapidapi-key": "a4dc6a92bemshd411cecf19a1136p197d8ejsnace6d7bd4d5e",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    console.log(options.params.year_of_birth);

    // axios request
    // axios
    //   .request(options)
    //   .then((response) => {
    //     console.log(response.data);
    //     this.setState({
    //       proposedSymptoms: response.data,
    //     });
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });

    this.setState({
      proposedSymptoms: proposed,
    });
  }

  updateInfoIssues(selectedIssues) {
    let issueid = 0;
    selectedIssues.forEach((item) => {
      issueid += item.ID;
    });
    console.log(issueid); //works
    const optionsIssues = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/issues/11/info",
      params: {
        language: "en-gb",
        issue_id: issueid,
      },
      headers: {
        "x-rapidapi-key": "a4dc6a92bemshd411cecf19a1136p197d8ejsnace6d7bd4d5e",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };
    // axios request
    axios
      .request(optionsIssues)
      .then((response) => {
        //response becomes text but should be array for multiselect
        let sym = response.data.PossibleSymptoms.split(",");
        for (let i = 0; i < sym.length; i++) {
          sym[i] = { Name: sym[i] };
        }
        this.setState({
          proposedIssues: sym,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  onSelect(selectedList, selectedItem) {
    let symptoms = this.state.selectedSymptoms;
    symptoms.push(selectedItem);
    this.setState({
      selectedSymptoms: symptoms,
    });
    console.log(symptoms);
    this.updateProposedSymptoms(symptoms);
  }

  onRemove(selectedList, removedItem) {
    let symptoms = this.state.selectedSymptoms;
    symptoms = symptoms.filter(function (obj) {
      return obj.Name !== removedItem.Name;
    });
    this.setState({
      selectedSymptoms: symptoms,
    });
    console.log(symptoms);
    this.updateProposedSymptoms(symptoms);
  }

  onProposedSelect(selectedList, selectedItem) {
    let symptoms = this.state.selectedProposedSymptoms;
    symptoms.push(selectedItem);
    this.setState({
      selectedProposedSymptoms: symptoms,
    });
    console.log(symptoms);
  }

  onProposedRemove(selectedList, removedItem) {
    let symptoms = this.state.selectedProposedSymptoms;
    symptoms = symptoms.filter(function (obj) {
      return obj.Name !== removedItem.Name;
    });
    this.setState({
      selectedProposedSymptoms: symptoms,
    });
    console.log(symptoms);
  }

  onSelectIssue(selectedList, selectedItem) {
    let issues = this.state.selectedIssues;
    issues.push(selectedItem);
    console.log(issues);
    this.setState({
      selectedIssues: issues,
    });
    console.log(issues);
    this.updateInfoIssues(issues);
  }

  onRemoveIssue(selectedList, removedItem) {
    let issues = this.state.selectedIssues;
    issues = issues.filter(function (obj) {
      return obj.Name !== removedItem.Name;
    });
    this.setState({
      selectedIssues: issues,
    });
    console.log(issues);
    this.updateInfoIssues(issues);
  }

  onProposedSelectIssue(selectedList, selectedItem) {
    let issues = this.state.proposedIssues;
    issues.push(selectedItem);
    this.setState({
      proposedIssues: issues,
    });
    console.log(issues);
  }

  onProposedRemoveIssue(selectedList, removedItem) {
    let issues = this.state.proposedIssues;
    issues = issues.filter(function (obj) {
      return obj.Name !== removedItem.Name;
    });
    this.setState({
      proposedIssues: issues,
    });
    console.log(issues);
  }

  additionalSymptoms() {
    if (this.state.selectedSymptoms.length > 0) {
      return (
        <div>
          <p>Are you also experiencing any the below symptoms?</p>
          <Multiselect
            options={this.state.proposedSymptoms} // Options to display in the dropdown
            onSelect={this.onProposedSelect} // Function will trigger on select event
            onRemove={this.onProposedRemove} // Function will trigger on remove event
            displayValue="Name" // Property name to display in the dropdown options
          />
        </div>
      );
    } else return null;
  }

  additionalIssues() {
    if (this.state.selectedIssues.length > 0) {
      return (
        <div>
          <p>Are you also experiencing any the below symptoms?</p>
          <Multiselect
            options={this.state.proposedIssues} // Options to display in the dropdown
            onSelect={this.onProposedSelectIssue} // Function will trigger on select event
            onRemove={this.onProposedRemoveIssue} // Function will trigger on remove event
            displayValue="Name" // Property name to display in the dropdown options
          />
        </div>
      );
    } else return null;
  }

  submitSymptoms() {
    let diagnosisId = [];
    let diagnosisName = [];
    let diagnosisRanking = [];
    let diagnosisAccuracy = [];
    let specialId = [];
    let specialName = [];

    let symptoms = "[";
    this.state.selectedSymptoms.forEach((item) => {
      symptoms += item.ID + ",";
    });
    this.state.selectedProposedSymptoms.forEach((item) => {
      symptoms += item.ID + ",";
    });
    symptoms = symptoms.substring(0, symptoms.length - 1) + "]";
    console.log(symptoms);

    const diagnosis = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/diagnosis",
      params: {
        gender: this.state.gender,
        year_of_birth: new Date(this.state.DOB).getFullYear(),
        language: "en-gb",
        symptoms: symptoms,
      },
      headers: {
        "x-rapidapi-key": "71491ac6a2msh7ddcf0ac4b9fab3p189889jsn5cf483e878e0",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    // axios request
    // axios
    //   .request(diagnosis)
    //   .then((response) => {
    //     console.log(response.data);
    //     response.data.forEach((item) => {
    //         diagnosisId.push(item["Issue"]["ID"]);
    //         diagnosisRanking.push(item["Issue"]["Ranking"]);
    //         diagnosisAccuracy.push(item["Issue"]["Accuracy"]);
    //         specialId.push(item["Specialization"]["ID"]);
    //         specialName.push(item["Specialization"]["Name"]);
    //     })
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });

    diagnosesspecials.forEach((item) => {
      diagnosisId.push(item["Issue"]["ID"]);
      diagnosisName.push(item["Issue"]["Name"]);
      diagnosisRanking.push(item["Issue"]["Ranking"]);
      diagnosisAccuracy.push(item["Issue"]["Accuracy"]);
      item["Specialisation"].forEach((special) => {
        specialId.push(special["ID"]);
        specialName.push(special["Name"]);
      });
    });

    /*console.log(diagnosisId)
        console.log(diagnosisRanking)
        console.log(diagnosisAccuracy)
        console.log(specialId)
        console.log(specialName)*/

    db.collection("Patients")
      .doc(this.props.location.data)
      .collection("DailyEntries")
      .doc()
      .set({
        DatePosted: new Date(Date.now()),
        Mood: document.getElementById("mood").value,
        Symptoms: this.state.selectedSymptoms.concat(
          this.state.selectedProposedSymptoms
        ),
      })
      .catch(function (error) {
        console.log("Error writing to document:", error);
      });

    diagnosisId.forEach((id, index) => {
      db.collection("Patients")
        .doc(this.props.location.data)
        .collection("PossibleDiagnosis")
        .doc()
        .set({
          DiagID: id,
          DiagName: diagnosisName[index],
          accuracy: diagnosisAccuracy[index],
          ranking: diagnosisRanking[index],
        })
        .catch(function (error) {
          console.log("Error writing to document:", error);
        });
    });

    specialId.forEach((id, index) => {
      db.collection("Patients")
        .doc(this.props.location.data)
        .collection("PossibleSpecializations")
        .doc()
        .set({
          SpecialID: id,
          name: specialName[index],
        })
        .catch(function (error) {
          console.log("Error writing to document:", error);
        });
    });

    this.setState({
      selectedSymptoms: [],
      selectedProposedSymptoms: [],
      selectedIssues: [],
    });
    document.getElementById("mood").value = "";
    document.getElementById("moodIssues").value = "";
  }
  render() {
    return (
      <div id="wrapper">
        <ul
          class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <a
            class="sidebar-brand d-flex align-items-center justify-content-center"
            href="index.html"
          >
            <div class="sidebar-brand-icon rotate-n-15">
              <IconContext.Provider
                value={{
                  size: "3em",
                }}
              >
                <FaBookMedical />
              </IconContext.Provider>
            </div>
            <div class="sidebar-brand-text mx-3">
              Welcome Jim!<sup></sup>
            </div>
          </a>

          <hr class="sidebar-divider my-0" />

          <li class="nav-item active">
            <a class="nav-link" href="index.html">
              <i class="fas fa-fw fa-tachometer-alt"></i>
              <span>Dr. Micheal Scott</span>
            </a>
          </li>

          <hr class="sidebar-divider" />

          <div class="sidebar-heading">Functionalities</div>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              <i class="fas fa-fw fa-cog"></i>
              <span>Settings</span>
            </a>
            <div
              id="collapseTwo"
              class="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Patient Referral</h6>
                <a class="collapse-item" href="buttons.html">
                  Email
                </a>
                <a class="collapse-item" href="cards.html">
                  Refer Account
                </a>
              </div>
            </div>
          </li>

          <hr class="sidebar-divider" />

          <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle"></button>
          </div>
        </ul>

        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content">
            <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <button
                id="sidebarToggleTop"
                class="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i class="fa fa-bars"></i>
              </button>

              <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown no-arrow d-sm-none">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="searchDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-search fa-fw"></i>
                  </a>

                  <div
                    class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                    aria-labelledby="searchDropdown"
                  ></div>
                </li>

                <div class="topbar-divider d-none d-sm-block"></div>

                <li class="nav-item dropdown no-arrow">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                      Patient: Jim Halpert
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
                    class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    <a class="dropdown-item" href="#">
                      <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </a>
                    <a class="dropdown-item" href="#">
                      <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                      Settings
                    </a>
                    <a class="dropdown-item" href="#">
                      <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                      Activity Log
                    </a>
                    <div class="dropdown-divider"></div>
                    <a
                      class="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
            </nav>

            <div class="container-fluid">
              <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">Daily Health Record</h1>
                <a
                  href="#"
                  class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                >
                  <IconContext.Provider value={{}}>
                    <FiDownload />
                  </IconContext.Provider>{" "}
                  Generate Report
                </a>
              </div>

              <div class="row">
                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Appointment
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            3 Jan 2021
                          </div>
                        </div>
                        <div class="col-auto">
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

                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Insurance Coverage
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            $2245.00
                          </div>
                        </div>
                        <div class="col-auto">
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

                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-info shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Health Progress
                          </div>
                          <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                54%
                              </div>
                            </div>
                            <div class="col">
                              <div class="progress progress-sm mr-2">
                                <div
                                  class="progress-bar bg-info"
                                  role="progressbar"
                                  aria-valuenow="50"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-auto">
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

                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-warning shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Alert
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            1
                          </div>
                        </div>
                        <div class="col-auto">
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

              <div class="row">
                <div class="col-xl-8 col-lg-7">
                  <div class="card shadow mb-4">
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 class="m-0 font-weight-bold text-primary">
                        Log Today's Health Status:
                      </h6>
                    </div>

                    <div class="card-body">
                      <h5> Create a New Entry!</h5>
                      <br></br>
                      <h5>Search by Symptoms</h5>
                      <div class="d-flex">
                        <p class="mr-2">
                          Please enter your mood from a scale of 1 to 5 (where 1
                          is poor, 5 is excellent):
                        </p>
                        <input id="mood" type="number" min="1" max="5" />
                      </div>
                      <br></br>
                      <div class="d-flex">
                        <p class="mr-2">Symptoms you are experiencing:</p>
                        <Multiselect
                          options={this.state.options} // Options to display in the dropdown
                          onSelect={this.onSelect} // Function will trigger on select event
                          onRemove={this.onRemove} // Function will trigger on remove event
                          displayValue="Name" // Property name to display in the dropdown options
                        />
                      </div>
                      <br></br>
                      {this.additionalSymptoms()}
                      <br></br>
                      <h5>Search by Issues</h5>
                      <div class="d-flex">
                        <p class="mr-2">
                          Please enter your mood from a scale of 1 to 5 (where 1
                          is poor, 5 is excellent):
                        </p>
                        <input id="moodIssues" type="number" min="1" max="5" />
                      </div>
                      <br></br>
                      <div class="d-flex">
                        <p class="mr-2">
                          Please select issues you may be experiencing:
                        </p>
                        <Multiselect
                          options={this.state.optionsIssues} // Options to display in the dropdown
                          onSelect={this.onSelectIssue} // Function will trigger on select event
                          onRemove={this.onRemoveIssue} // Function will trigger on remove event
                          displayValue="Name" // Property name to display in the dropdown options
                        />
                      </div>
                      <br></br>
                      {this.additionalIssues()}
                      <br></br>
                      <div
                        className="btn btn-primary"
                        onClick={this.submitSymptoms}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                </div>

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
                      <p>
                        Dec 25 2020: Let me know if you have any more pain
                        <hr />
                        Dec 12 2020: Take 1 advil in the morning and 1 in the
                        evening
                        <hr />
                        Dec 5 2020: Want to book an appointment with you in
                        2021, see you soon
                      </p>
                      <a
                        target="_blank"
                        rel="nofollow"
                        href="https://undraw.co/"
                      >
                        See more Notes --
                      </a>
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

export default PatientDashboard1;
