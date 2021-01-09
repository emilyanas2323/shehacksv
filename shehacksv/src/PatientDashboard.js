import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import axios from "axios";
import {res, proposed} from './data.js'

class PatientDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.additionalSymptoms = this.additionalSymptoms.bind(this);
        
        this.state = {
            options: [],
            selectedSymptoms: [],
        };
    }

  componentDidMount() {
    const options = {
        method: 'GET',
        url: 'https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms',
        params: {language: 'en-gb', format: 'json'},
        headers: {
          'x-rapidapi-key': '71491ac6a2msh7ddcf0ac4b9fab3p189889jsn5cf483e878e0',
          'x-rapidapi-host': 'priaid-symptom-checker-v1.p.rapidapi.com'
        }
      };
      
      /*axios.request(options)
      .then(function (response) {
          console.log(response.data);
          res = response.data;
          console.log(res)
          this.setState({
            options: res
          });
      })
      .catch(function (error) {
          console.error(error);
      });*/
      console.log(res)
      this.setState({
          options: res
      })
  }

  onSelect(selectedList, selectedItem) {
    let symptoms = this.state.selectedSymptoms;
    symptoms.push(selectedItem);
    this.setState({
        selectedSymptoms: symptoms
    })
    console.log(symptoms)
}

onRemove(selectedList, removedItem) {
    let symptoms = this.state.selectedSymptoms;
    symptoms = symptoms.filter(function( obj ) {
        return obj.Name !== removedItem.Name;
    });
    this.setState({
        selectedSymptoms: symptoms
    })
    console.log(symptoms)
}

  additionalSymptoms() {
      if(this.state.selectedSymptoms.length > 0) {
        let symptoms = [];
        this.state.selectedSymptoms.forEach((item) => {
            symptoms.push(item.ID);
        })
        console.log(symptoms)
        const options = {
            method: 'GET',
            url: 'https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms/proposed',
            params: {gender: 'male', year_of_birth: '1984', language: 'en-gb', symptoms: ''+symptoms},
            headers: {
              'x-rapidapi-key': '71491ac6a2msh7ddcf0ac4b9fab3p189889jsn5cf483e878e0',
              'x-rapidapi-host': 'priaid-symptom-checker-v1.p.rapidapi.com'
            }
          };
          
          /*axios.request(options).then(function (response) {
              console.log(response.data);
          }).catch(function (error) {
              console.error(error);
          });*/

          return(
            <div>
                <p>Are you also experiencing any the below symptoms?</p>
                <Multiselect
                    options={this.state.options} // Options to display in the dropdown
                    onSelect={this.onSelect} // Function will trigger on select event
                    onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue="Name" // Property name to display in the dropdown options
                />
            </div>
          );
      }
      else return null;
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
            { this.additionalSymptoms() }
            <div className="btn btn-primary">Submit</div>
        </div>
    );
  }
}

export default PatientDashboard;
