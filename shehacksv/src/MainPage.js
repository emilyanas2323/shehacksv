import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import { res, proposed } from "./data.js";
import "./App.css";
import { Link } from "react-router-dom";
import { FaBookMedical } from 'react-icons/fa';
import { IconContext } from "react-icons";

class MainPage extends React.Component {
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
                      <IconContext.Provider value={{
                              size: "3em"
                            }}
                          >
                            <FaBookMedical />
                          </IconContext.Provider>
                        <br></br>
                        <br></br>
                        <h1 className="h4 text-gray-900 mb-4">
                          Welcome to DocLog!
                        </h1>
                        <hr/>
                        <h3 className="h5 text-gray-900 mb-4">
                          Are you a patient or a doctor?
                        </h3>
                      </div>

                      <form className="user">
                                           
                     
                        <Link
                          to="/patientsignup"
                          className="btn btn-primary btn-user btn-block"
                        >
                          Patient
                        </Link>
                        <Link
                          to="/doctorsignup"
                          className="btn btn-primary btn-user btn-block"
                        >
                          Doctor
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

export default MainPage;
