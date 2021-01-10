import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed } from "./data.js";
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
    this.updateInfoIssues = this.updateInfoIssues.bind(this);


    this.state = {
      issueid: 0,
      options: [],
      optionsIssues: [],
      selectedSymptoms: [],
      proposedSymptoms: [],
      selectedIssues: [],
      proposedIssues: [],
      firstName: "",
      lastName: "",
      DOB: new Date(),
      gender: "",
    };
  }

  componentDidMount() {
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
    /*this.setState({
          options: res
      })*/

    var docRef = db.collection("Patients").doc("ZqlHkyxyukrONHYZq2bH");
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
        proposedSymptoms: proposed
    })*/
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
    let symptoms = this.state.proposedSymptoms;
    symptoms.push(selectedItem);
    this.setState({
      proposedSymptoms: symptoms,
    });
    console.log(symptoms);
  }

  onProposedRemove(selectedList, removedItem) {
    let symptoms = this.state.proposedSymptoms;
    symptoms = symptoms.filter(function (obj) {
      return obj.Name !== removedItem.Name;
    });
    this.setState({
      proposedSymptoms: symptoms,
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


  render() {
    return (
      <div>
        <h1 className="text-center">Patient Dashboard</h1>
        <h2>Create A New Entry</h2>
        <h3>Search by symptoms</h3>
        <p>Please select the symptoms you are experiencing:</p>
        <Multiselect
          options={this.state.options} // Options to display in the dropdown
          onSelect={this.onSelect} // Function will trigger on select event
          onRemove={this.onRemove} // Function will trigger on remove event
          displayValue="Name" // Property name to display in the dropdown options
        />
        {this.additionalSymptoms()}
        <h3>Search by issues</h3>
        <p>Please select the issues you are experiencing:</p>
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
