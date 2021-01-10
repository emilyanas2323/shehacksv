import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed, diagnosesspecials } from "./data.js";
import { db } from "./firebaseConfig";

class PatientDashboard extends React.Component {
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
          options: res
    })

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
        proposedSymptoms: proposed
    })
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
     .then((response) => { //response becomes text but should be array for multiselect
        let sym = response.data.PossibleSymptoms.split(",");
        for (let i = 0; i<sym.length; i++){
            sym[i] = {Name: sym[i]};
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
      url: 'https://priaid-symptom-checker-v1.p.rapidapi.com/diagnosis',
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
        })
    })

    /*console.log(diagnosisId)
    console.log(diagnosisRanking)
    console.log(diagnosisAccuracy)
    console.log(specialId)
    console.log(specialName)*/

    db
    .collection("Patients")
    .doc(this.props.location.data)
    .collection("DailyEntries")
    .doc()
    .set({
      DatePosted: new Date(Date.now()),
      Mood: document.getElementById("mood").value,
      Symptoms: this.state.selectedSymptoms.concat(this.state.selectedProposedSymptoms),
    }).catch(function (error) {
      console.log("Error writing to document:", error);
    });

    diagnosisId.forEach((id, index) => {
        db
        .collection("Patients")
        .doc(this.props.location.data)
        .collection("PossibleDiagnosis")
        .doc()
        .set({
        DiagID: id,
        DiagName: diagnosisName[index],
        accuracy: diagnosisAccuracy[index],
        ranking: diagnosisRanking[index],
        }).catch(function (error) {
        console.log("Error writing to document:", error);
        });
    })

    specialId.forEach((id, index) => {
        db
        .collection("Patients")
        .doc(this.props.location.data)
        .collection("PossibleSpecializations")
        .doc()
        .set({
        SpecialID: id,
        name: specialName[index],
        }).catch(function (error) {
        console.log("Error writing to document:", error);
        });
    })
  }

  render() {
    return (
      <div className="patient-dashboard-container">
        <h1 className="text-center">Patient Dashboard</h1>
        <h2>Create A New Entry</h2>
        <h3>Search by symptoms</h3>
        <p>Please enter your mood from a scale of 1 to 5 (where 1 is poor, 5 is excellent):</p>
        <input id="mood" type="number" min="1" max="5" />
        <p>Please select the symptoms you are experiencing:</p>
        <Multiselect
          options={this.state.options} // Options to display in the dropdown
          onSelect={this.onSelect} // Function will trigger on select event
          onRemove={this.onRemove} // Function will trigger on remove event
          displayValue="Name" // Property name to display in the dropdown options
        />
        {this.additionalSymptoms()}

        <h3>Search by issues</h3>
        <p>Please enter your mood from a scale of 1 to 5 (where 1 is poor, 5 is excellent):</p>
        <input id="mood" type="number" min="1" max="5" />
        <p>Please select issues you may be experiencing:</p>
        <Multiselect
          options={this.state.optionsIssues} // Options to display in the dropdown
          onSelect={this.onSelectIssue} // Function will trigger on select event
          onRemove={this.onRemoveIssue} // Function will trigger on remove event
          displayValue="Name" // Property name to display in the dropdown options
        />
        {this.additionalIssues()}
        <div className="btn btn-primary">Submit</div>
      </div>
    );
  }
}

export default PatientDashboard;
