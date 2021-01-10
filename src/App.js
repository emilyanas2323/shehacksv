import "./App.css";
import PatientDashboard from "./PatientDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientSignUp from "./PatientSignUp";
import MainPage from "./MainPage";
import DoctorSignUp from "./DoctorSignUp";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard1 from "./tmp";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/patientsignup" component={PatientSignUp} />
          <Route exact path="/doctorsignup" component={DoctorSignUp} />
          <Route exact path="/patientdashboard" component={PatientDashboard} />
          <Route exact path="/patientdashboard1" component={PatientDashboard1} />
          <Route exact path="/doctordashboard" component={DoctorDashboard} />
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
