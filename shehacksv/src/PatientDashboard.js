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
    this.onProposedSelect = this.onProposedSelect.bind(this);
    this.onProposedRemove = this.onProposedRemove.bind(this);
    this.additionalSymptoms = this.additionalSymptoms.bind(this);
    this.updateProposedSymptoms = this.updateProposedSymptoms.bind(this);

    this.state = {
      options: [],
      selectedSymptoms: [],
      proposedSymptoms: [],
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
        "x-rapidapi-key": "71491ac6a2msh7ddcf0ac4b9fab3p189889jsn5cf483e878e0",
        "x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com",
      },
    };

    // axios request
    // axios
    //   .request(options)
    //   .then((response) => {
    //     console.log(response.data);
    //     this.setState({
    //       options: response.data,
    //     });
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });

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
        "x-rapidapi-key": "71491ac6a2msh7ddcf0ac4b9fab3p189889jsn5cf483e878e0",
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

    /*this.setState({
        proposedSymptoms: proposed
    })*/
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
        <div className="btn btn-primary">Submit</div>
      </div>
    );
  }
}

export default PatientDashboard;
