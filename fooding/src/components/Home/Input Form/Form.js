import React, { Component } from "react";

export default class Form extends Component {
  render() {
    return (
      <div>
        <div className="form-row">
          <div className="col-md-6 mb-3">
            <label htmlFor="foodname">Name</label>
            <input
              type="text"
              className="form-control"
              id="foodname"
              placeholder="Food Item Name"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="foodcategory">Category</label>
            <input
              type="text"
              className="form-control"
              id="foodcategory"
              placeholder="Food Category"
              required
            />
          </div>
        </div>
        <div className="form-group mt-4">
          <label htmlFor="fooddescription">Description</label>
          <textarea
            className="form-control"
            id="fooddescription"
            rows="3"
            placeholder="Food Description"
            required
          />
        </div>
      </div>
    );
  }
}
