import React, { Component } from 'react';
import * as jobCall from './jobCalls';
import './App.css';
// import ShowResults from './showResults'

class App extends Component {

  constructor() {
    super()

    this.state = {
      job_total: undefined,
      down_payment_percentage: undefined,
      material1: undefined,
      material2: undefined,
      material3: undefined,
      material4: undefined,
      ct_split: undefined,
      sub_split: undefined,
      name0: undefined,
      name1: undefined,
      name2: undefined,
      weight0: undefined,
      weight1: undefined,
      weight2: undefined,
      hours0: undefined,
      hours1: undefined,
      hours2: undefined,
      overall_costs: {},
      painter_rates: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculateJob = this.calculateJob.bind(this);
  }

  handleInputChange(stateName, event) {

    let newStateElement = {}
    newStateElement[stateName] = event.target.value

    this.setState(newStateElement)

  }

  calculateJob() {

    let info = {
      job_total: parseFloat(this.state.job_total, 10),
      down_payment_percentage: parseInt(this.state.down_payment_percentage, 10)/100,
      materials: [parseFloat(this.state.material1, 10), parseFloat(this.state.material2, 10), parseFloat(this.state.material3, 10), parseFloat(this.state.material4, 10)],
      ct_split: parseInt(this.state.ct_split, 10)/100,
      sub_split: parseInt(this.state.sub_split, 10)/100,
      labor_info: [{
        name: this.state.name0,
        weight: parseInt(this.state.weight0, 10)/100,
        hours: parseInt(this.state.hours0, 10)
      },{
        name: this.state.name1,
        weight: parseInt(this.state.weight1, 10)/100,
        hours: parseInt(this.state.hours1, 10)
      },{
        name: this.state.name2,
        weight: parseInt(this.state.weight2, 10)/100,
        hours: parseInt(this.state.hours2, 10)
      }]
    }

    console.log(info)
    jobCall.sendJobInfo(info).then(response => {
      console.log('sign up: ', response)
      this.setState({overall_costs: response.overall_costs, painter_rates: response.painter_rates})
      // this.props.userLoggedIn(response)
    })
  }

  render() {

    const {overall_costs, painter_rates} = this.state

    return (
      <div className="App">
        <h1>Job Calculator</h1>
        <div className="main">
          <div className="left-side">
            <h3 className="underline">Inputs</h3>
            <div className="job-container-input">
              <label htmlFor="job-total-input">Job Total: </label>
              <input 
                type="text" 
                className="form-control" 
                id="job-total-input" 
                name="job-total" 
                onChange={this.handleInputChange.bind(null, 'job_total')}/>
            </div>
            <div className="job-container-input">
              <label htmlFor="down-payment-percentage-input">Down Payment Percentage: </label>
              <input 
                type="text" 
                className="form-control" 
                id="down-payment-percentage-input" 
                name="down-payment-percentage" 
                onChange={this.handleInputChange.bind(null, 'down_payment_percentage')}/>
            </div>
            <div className="job-container-input">
              <label htmlFor="materials-input">Materials: </label>
              <input 
                type="text" 
                className="form-control" 
                id="materials-input" 
                name="materials" 
                onChange={this.handleInputChange.bind(null, 'material1')}/><br/>
              <input 
                type="text" 
                className="form-control" 
                id="materials-input" 
                name="materials" 
                onChange={this.handleInputChange.bind(null, 'material2')}/><br/>
              <input 
                type="text" 
                className="form-control" 
                id="materials-input" 
                name="materials" 
                onChange={this.handleInputChange.bind(null, 'material3')}/><br/>
              <input 
                type="text" 
                className="form-control" 
                id="materials-input" 
                name="materials" 
                onChange={this.handleInputChange.bind(null, 'material4')}/>
            </div>
            <div className="job-container-input">
              <label htmlFor="ct-split-input">Contractor Split: </label>
              <input 
                type="text" 
                className="form-control" 
                id="ct-split-input" 
                name="ct-split" 
                onChange={this.handleInputChange.bind(null, 'ct_split')}/>
            </div>
            <div className="job-container-input">
              <label htmlFor="sub-split-input">Sub-Contractor Split: </label>
              <input 
                type="text" 
                className="form-control" 
                id="sub-split-input" 
                name="sub-split" 
                onChange={this.handleInputChange.bind(null, 'sub_split')}/>
            </div>

            <h3>Painters</h3>
            <div className="painters-box">
              <div className="job-container-input">
              <label htmlFor="name-input">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name-input" 
                  name="name-input" 
                  onChange={this.handleInputChange.bind(null, 'name0')}/>
              </div>
              <div className="job-container-input">
              <label htmlFor="weight-input">Weight</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="weight-input" 
                  name="weight" 
                  onChange={this.handleInputChange.bind(null, 'weight0')}/>
              </div>
              <div className="job-container-input">
              <label htmlFor="hours-input">Hours</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="hours-input" 
                  name="hours" 
                  onChange={this.handleInputChange.bind(null, 'hours0')}/>
              </div>
            </div>
            {/* <hr /> */}
            {/* ------------- */}

            <div className="painters-box">
              <div className="job-container-input">
              <label htmlFor="name-input">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name-input" 
                  name="name-input" 
                  onChange={this.handleInputChange.bind(null, 'name1')}/>
              </div>
              <div className="job-container-input">
              <label htmlFor="weight-input">Weight</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="weight-input" 
                  name="weight" 
                  onChange={this.handleInputChange.bind(null, 'weight1')}/>
              </div>
              <div className="job-container-input">
              <label htmlFor="hours-input">Hours</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="hours-input" 
                  name="hours" 
                  onChange={this.handleInputChange.bind(null, 'hours1')}/>
              </div>
            </div>
            {/* <hr /> */}
            {/* ------------- */}

            <div className="painters-box">
              <div className="job-container-input">
              <label htmlFor="name-input">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name-input" 
                  name="name-input" 
                  onChange={this.handleInputChange.bind(null, 'name2')}/>
              </div>
              <div className="job-container-input">
              <label htmlFor="weight-input">Weight</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="weight-input" 
                  name="weight" 
                  onChange={this.handleInputChange.bind(null, 'weight2')}/>
              </div>
              <div className="job-container-input">
              <label htmlFor="hours-input">Hours</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="hours-input" 
                  name="hours" 
                  onChange={this.handleInputChange.bind(null, 'hours2')}/>
              </div>
            </div>

          <button className="calculate-button" onClick={this.calculateJob}>Cal-culate. That. Job!</button>

          </div>
          <div className="right-side">
            <h3 class="underline">Results</h3>
            {painter_rates.length > 0 && <div>
              <span>Down Payment: ${overall_costs.down_payment}</span><br/>
              <span>Labor: ${overall_costs.labor}</span><br/>
              <span>Materials Total: ${overall_costs.materials_total}</span><br/>
              <span>Contractor Split Amount: ${overall_costs.ct_split}</span><br/>
              <span>Contractor Split Payout: ${overall_costs.ct_split_final_payout}</span><br/>
              <span>Sub Contractor Split Amount: ${overall_costs.sub_split}</span><br/>
              <span>Sub Contractor Split Spill Over: ${overall_costs.sub_split_left_over}</span><br/>

              <h3>Painters</h3>
              <div className="painters-box">
                <span>Name: {painter_rates[0].name}</span><br/>
                <span>Hourly Average: ${painter_rates[0].hourly_average}</span><br/>
                <span>Hours: {painter_rates[0].hours}</span><br/>
                <span>Total Hours: {painter_rates[0].total_hours}</span><br/>
                <span>Weight: {painter_rates[0].weight}</span><br/>
                <span>Payout: ${painter_rates[0].payout}</span><br/>
              </div>
              <div className="painters-box">
                <span>Name: {painter_rates[1].name}</span><br/>
                <span>Hourly Average: ${painter_rates[1].hourly_average}</span><br/>
                <span>Hours: {painter_rates[1].hours}</span><br/>
                <span>Total Hours: {painter_rates[1].total_hours}</span><br/>
                <span>Weight: {painter_rates[1].weight}</span><br/>
                <span>Payout: ${painter_rates[1].payout}</span><br/>
              </div>
              <div className="painters-box">
                <span>Name: {painter_rates[2].name}</span><br/>
                <span>Hourly Average: ${painter_rates[2].hourly_average}</span><br/>
                <span>Hours: {painter_rates[2].hours}</span><br/>
                <span>Total Hours: {painter_rates[2].total_hours}</span><br/>
                <span>Weight: {painter_rates[2].weight}</span><br/>
                <span>Payout: ${painter_rates[2].payout}</span><br/>
              </div>
            </div>}
          </div>
        </div>
        {/* <div className="space"></div> */}
      </div>
    );
  }
}

export default App;
