import React, { Component } from "react";
import "./Home.css";
import FormFields from "./Input Form/Form.js";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: undefined,
      foodId: undefined,
      updateFeedback: undefined,
      successFeedback: undefined,
      feedback: undefined
    };
    this.handleFoodFormSubmission = this.handleFoodFormSubmission.bind(this);
    this.passFoodIdToModal = this.passFoodIdToModal.bind(this);
    this.handleFoodEdit = this.handleFoodEdit.bind(this);
    this.handlefoodRemove = this.handlefoodRemove.bind(this);
  }

  //---- Fetching food details Initially ----//
  componentDidMount() {
    fetch("/api/foods")
      .then(res => res.json())
      .then(data => {
        this.setState({ foods: data.data });
      })
      .catch(err => `Error in fetching food details. -- ${err}`);
  }

  //------- Food Form Submission Handler -------//
  handleFoodFormSubmission(event) {
    event.preventDefault();
    let data = {
      name: document.getElementById("foodname").value,
      category: document.getElementById("foodcategory").value,
      description: document.getElementById("fooddescription").value
    };

    //Regex to Check only String
    let string_regex1 = /^[a-zA-Z_.\s]{3,}$/; //For only words > 3 with whitespace
    //let string_regex2 = /^\w{3,}$/; //For words length > 3

    // console.log(
    //   string_regex1.test(data.name),
    //   //string_regex2.test(data.name),
    //   string_regex1.test(data.category),
    //   //string_regex2.test(data.category),
    //   string_regex1.test(data.description)
    //   //string_regex2.test(data.description)
    // );

    if (
      string_regex1.test(data.name) &&
      string_regex1.test(data.category) &&
      string_regex1.test(data.description)
    ) {
      fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.setState({ feedback: "Error occured in saving food details" });
            //disappear feedback in 4sec
            return setTimeout(() => {
              this.setState({
                feedback: ""
              });
            }, 4000);
          } else {
            document.getElementById("foodname").value = "";
            document.getElementById("foodcategory").value = "";
            document.getElementById("fooddescription").value = "";
            this.setState(
              {
                successFeedback: "Food details saved Successfully, ThankYou!"
              },
              () => {
                window.location = "/#Section2";
                this.componentDidMount();
              }
            );
            //disappear feedback in 4sec
            setTimeout(() => {
              this.setState({
                successFeedback: ""
              });
            }, 4000);
          }
        })
        .catch(err => console.log(`Error in form submission. -- ${err}`));
    } else {
      this.setState({ feedback: "Please enter valid inputs." });
      //disappear feedback in 4sec
      setTimeout(() => {
        this.setState({
          feedback: ""
        });
      }, 4000);
    }
  }

  //---- To pass appropriate FoodId to Edit/Delete ----//
  passFoodIdToModal(event) {
    this.setState({ foodId: event.currentTarget.id });
  }

  //---- To Edit/Update food details ----//
  handleFoodEdit(event) {
    event.preventDefault();
    let data = {
      name: document.getElementById("newfoodname").value,
      category: document.getElementById("newfoodcategory").value,
      description: document.getElementById("newfooddescription").value
    };
    console.log(data);
    //Regex to Check only String
    let string_regex1 = /^[a-zA-Z_.\s]{3,}$/; //For only words > 3 with whitespace
    if (
      string_regex1.test(data.name) &&
      string_regex1.test(data.category) &&
      string_regex1.test(data.description)
    ) {
      fetch(`/api/update/${this.state.foodId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.setState({ updateFeedback: data.error });
            //disappear feedback in 4sec
            return setTimeout(() => {
              this.setState({
                feedback: ""
              });
            }, 4000);
          } else {
            //---- Reset input fields ----//
            document.getElementById("newfoodname").value = "";
            document.getElementById("newfoodcategory").value = "";
            document.getElementById("newfooddescription").value = "";
            this.setState(
              {
                updateFeedback: "Food details updated Successfully."
              },
              () => {
                this.componentDidMount();
              }
            );
            //disappear feedback in 4sec
            setTimeout(() => {
              this.setState({
                feedback: ""
              });
            }, 4000);
          }
        })
        .catch(err =>
          console.log(`Error in update form submission. -- ${err}`)
        );
    } else {
      this.setState({ updateFeedback: "Please enter valid inputs." });
      //disappear feedback in 4sec
      setTimeout(() => {
        this.setState({
          updateFeedback: ""
        });
      }, 4000);
    }
  }

  //---- To Delete food details ----//
  handlefoodRemove(event) {
    event.preventDefault();
    fetch(`/api/delete/${this.state.foodId}`, {
      method: "DELETE",
      headres: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ successFeedback: data.delete_message }, () => {
          this.componentDidMount();
        });
        //disappear feedback in 4sec
        setTimeout(() => {
          this.setState({
            successFeedback: ""
          });
        }, 4000);
      })
      .catch(err => `Error in fetching food details. -- ${err}`);
  }

  render() {
    return (
      <div className="home-wrapper">
        <div className="bg-image">
          <div className="row">
            <div className="col-md-8 input-fields text-center">
              <h1>Hey There!</h1>
              <form
                className="mt-4"
                onSubmit={this.handleFoodFormSubmission}
                validate="true"
              >
                <FormFields />
                {/** Show Feedback to user */}
                <p className="mt-2 feedback-field">
                  {this.state.feedback ? this.state.feedback : ""}
                </p>
                <button
                  type="submit"
                  className="btn btn-outline-success btn-lg mt-4 proceed-button"
                >
                  Proceed to add...
                </button>
              </form>
            </div>
          </div>
        </div>

        <p className="successFeedback text-center">
          {this.state.successFeedback}
        </p>

        {/*------- To Render Food Items -------------- */}
        <div
          id="Section2"
          className="container food_cards_wrapper text-center"
          //style={this.state.foods ? { height: "50vh" } : {}}
        >
          {this.state.foods
            ? this.state.foods.map(food => {
                return (
                  <div key={food._id} className="row added_food_animation">
                    <div className="col-md-12">
                      <div className="card food_card">
                        <div className="card-header header ">
                          <div className="row justify-content-center">
                            <div className="col-md-2 justify-content-center">
                              <button
                                id={food._id}
                                className="btn btn-outline-success"
                                style={{
                                  height: "30px",
                                  width: "70px",
                                  fontSize: "13px"
                                }}
                                data-toggle="modal"
                                data-target="#editfoodModal"
                                onClick={this.passFoodIdToModal}
                              >
                                Edit
                              </button>
                            </div>
                            {/*------ EDIT Bootstrap Modal --------*/}
                            <div
                              className="modal fade"
                              id="editfoodModal"
                              tabIndex="-1"
                              role="dialog"
                              aria-hidden="true"
                            >
                              <div
                                className="modal-dialog modal-dialog-centered"
                                role="document"
                              >
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">
                                      Edit Food Details
                                    </h5>
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="modal"
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    {/*-------- Food form field --------*/}
                                    <div>
                                      <div className="form-row">
                                        <div className="col-md-6 mb-3">
                                          <label htmlFor="newfoodname">
                                            Name
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="newfoodname"
                                            placeholder="Food Item Name"
                                            required
                                          />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                          <label htmlFor="newfoodcategory">
                                            Category
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="newfoodcategory"
                                            placeholder="Food Category"
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group mt-4">
                                        <label htmlFor="newfooddescription">
                                          Description
                                        </label>
                                        <textarea
                                          className="form-control"
                                          id="newfooddescription"
                                          rows="3"
                                          placeholder="Food Description"
                                          required
                                        />
                                      </div>
                                    </div>
                                    {/*-------- Update Feedback Message --------*/}
                                    <p className="updateFeedback">
                                      {this.state.updateFeedback}
                                    </p>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      data-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    <button
                                      id={this.state.foodId}
                                      type="button"
                                      className="btn btn-success btn-sm"
                                      onClick={this.handleFoodEdit}
                                    >
                                      Save changes
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/*------ EDIT Modal Close --------*/}
                            <div className="col-md-8">
                              <h5 className="text-center my-2">
                                {food.name} || {food.category}
                              </h5>
                            </div>

                            <div className="col-md-2 d-flex justify-content-center">
                              <button
                                id={food._id}
                                className="btn btn-outline-danger"
                                style={{
                                  height: "30px",
                                  width: "70px",
                                  fontSize: "13px"
                                }}
                                data-target="#deleteModal"
                                data-toggle="modal"
                                onClick={this.passFoodIdToModal}
                              >
                                Delete
                              </button>
                            </div>
                            {/*------ DELETE Bootstrap Modal --------*/}
                            <div
                              className="modal fade"
                              id="deleteModal"
                              tabIndex="-1"
                              role="dialog"
                              aria-hidden="true"
                            >
                              <div
                                className="modal-dialog modal-dialog-centered"
                                role="document"
                              >
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">
                                      Delete Food Item?
                                    </h5>
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="modal"
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    This is irreversible.
                                    <br />
                                    Are you sure you want to do this?
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      data-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    <button
                                      id={this.state.foodId}
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      data-dismiss="modal"
                                      onClick={this.handlefoodRemove}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/*------ DELETE Modal Close --------*/}
                          </div>
                        </div>
                        <div className="card-body body">
                          <div className="row">
                            <div className="col-md-12">
                              <p className="card-title">{food.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    );
  }
}
