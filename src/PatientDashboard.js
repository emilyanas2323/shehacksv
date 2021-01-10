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
      selectedProposedIssues: [],
      selectedProposedSymptoms: [],
      firstName: "",
      lastName: "",
      DOB: new Date(),
      gender: "",
      doctorNotes: []
    };
  }

  componentDidMount() {
    console.log(this.props.location.data);
    const options = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms",
      params: { language: "en-gb", format: "json" },
      headers: {
        "x-rapidapi-key": "5036017efcmsh867db4f8336388dp17b645jsn9e482eeeab6d",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    const optionsIssues = {
      method: "GET",
      url: "https://priaid-symptom-checker-v1.p.rapidapi.com/issues",
      params: { language: "en-gb", format: "json" },
      headers: {
        "x-rapidapi-key": "5036017efcmsh867db4f8336388dp17b645jsn9e482eeeab6d",
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
    /*this.setState({
      options: res,
    });*/

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

    // Read from Patient's doctors notes (inside PatientDashboard)
    let notes = [];
    db.collection("Patients")
    .doc("xvNZKLiWlT5AQPupBJ27") // Patient's ID, we can pass this in 
    .collection("DoctorNotes")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            notes.push(doc.data()["additional notes"])
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    this.setState({
        doctorNotes: notes
    })
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
        "x-rapidapi-key": "5036017efcmsh867db4f8336388dp17b645jsn9e482eeeab6d",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    // axios request
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        this.setState({
          proposedSymptoms: response.data,
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    /*this.setState({
      proposedSymptoms: proposed,
    });*/
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
        "x-rapidapi-key": "5036017efcmsh867db4f8336388dp17b645jsn9e482eeeab6d",
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
    let issues = this.state.selectedProposedIssues;
    issues.push(selectedItem);
    this.setState({
        selectedProposedIssues: issues,
    });
    console.log(issues);
  }

  onProposedRemoveIssue(selectedList, removedItem) {
    let issues = this.state.selectedProposedIssues;
    issues = issues.filter(function (obj) {
      return obj.Name !== removedItem.Name;
    });
    this.setState({
        selectedProposedIssues: issues,
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
        "x-rapidapi-key": "5036017efcmsh867db4f8336388dp17b645jsn9e482eeeab6d",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    // axios request
    axios
      .request(diagnosis)
      .then((response) => {
        console.log(response.data);
        response.data.forEach((item) => {
            diagnosisId.push(item["Issue"]["ID"]);
            diagnosisRanking.push(item["Issue"]["Ranking"]);
            diagnosisAccuracy.push(item["Issue"]["Accuracy"]);
            specialId.push(item["Specialization"]["ID"]);
            specialName.push(item["Specialization"]["Name"]);
        })
      })
      .catch(function (error) {
        console.error(error);
      });

    /*diagnosesspecials.forEach((item) => {
      diagnosisId.push(item["Issue"]["ID"]);
      diagnosisName.push(item["Issue"]["Name"]);
      diagnosisRanking.push(item["Issue"]["Ranking"]);
      diagnosisAccuracy.push(item["Issue"]["Accuracy"]);
      item["Specialisation"].forEach((special) => {
        specialId.push(special["ID"]);
        specialName.push(special["Name"]);
      });
    });*/

    console.log(diagnosisId)
        console.log(diagnosisRanking)
        console.log(diagnosisAccuracy)
        console.log(specialId)
        console.log(specialName)

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
      selectedProposedIssues: []
    });
    document.getElementById("mood").value = "";
    document.getElementById("moodIssues").value = "";
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
              <IconContext.Provider
                value={{
                  size: "3em",
                }}
              >
                <FaBookMedical />
              </IconContext.Provider>
            </div>
            <div className="sidebar-brand-text mx-3">
              Welcome Jim!<sup></sup>
            </div>
          </a>

          <hr className="sidebar-divider my-0" />

          <li className="nav-item active">
            <a className="nav-link" href="index.html">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Dr. Micheal Scott</span>
            </a>
          </li>
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
                  ></div>
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
                <h1 className="h3 mb-0 text-gray-800">Daily Health Record</h1>
                <a
                  href="#"
                  className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                >
                  <IconContext.Provider value={{}}>
                    <FiDownload />
                  </IconContext.Provider>{" "}
                  Generate Report
                </a>
              </div>

              <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Appointment
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
                            Health Progress
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
                            Alert
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            1
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
                        Log Today's Health Status:
                      </h6>
                    </div>

                    <div className="card-body">
                      <h5> Create a New Entry!</h5>
                      <br></br>
                      <h5>Search by Symptoms</h5>
                      <div className="d-flex">
                        <p className="mr-2">
                          Please enter your mood from a scale of 1 to 5 (where 1
                          is poor, 5 is excellent):
                        </p>
                        <input id="mood" type="number" min="1" max="5" />
                      </div>
                      <br></br>
                      <div className="d-flex">
                        <p className="mr-2">Symptoms you are experiencing:</p>
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
                      <h5>Search by Medical Condition</h5>
                      <div className="d-flex">
                        <p className="mr-2">
                          Please enter your mood from a scale of 1 to 5 (where 1
                          is poor, 5 is excellent):
                        </p>
                        <input id="moodIssues" type="number" min="1" max="5" />
                      </div>
                      <br></br>
                      <div className="d-flex">
                        <p className="mr-2">
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

                <div className="col-xl-4 col-lg-5">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">
                        Doctor's Notes
                      </h6>
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
                      <p>Dec 25 2020: Let me know if you have any more pain</p>
                      <hr/>
                      <p>Dec 12 2020: Take 1 advil in the morning and 1 in the evening</p>
                      <hr/>
                        <p>Dec 5 2020: Want to book an appointment with you in
                        2021, see you soon</p>
                      <a
                        target="_blank"
                        rel="nofollow"
                        href="https://undraw.co/"
                      >
                        See more Notes
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
