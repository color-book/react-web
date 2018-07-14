import React, { Component } from 'react';
import * as jobCall from './jobCalls';
import './App.css';
import { IndexList } from './utilities'
// import ShowResults from './showResults'

class App extends Component {

  constructor() {
    super()

    this.state = {
      job_total: undefined,
      down_payment_percentage: undefined,
      materials: [{amount: ''}],
      ct_split: undefined,
      sub_split: undefined,
      labor: [{name: '', weight: '', hours: ''}],
      overall_costs: {},
      painter_rates: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculateJob = this.calculateJob.bind(this);
    this.handleAddMaterials = this.handleAddMaterials.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.handleRemoveMaterials = this.handleRemoveMaterials.bind(this);
    this.handleAddPainter = this.handleAddPainter.bind(this);
    this.handlePainterChange = this.handlePainterChange.bind(this);
    this.handleRemovePainter = this.handleRemovePainter.bind(this);
    this.getIndexPhrase = this.getIndexPhrase.bind(this);
    this.convertLaborToFloat = this.convertLaborToFloat.bind(this);
  }

  getIndexPhrase(index) {
    return IndexList[index]
  }

  handleInputChange(stateName, event) {

    let newStateElement = {}
    newStateElement[stateName] = event.target.value

    this.setState(newStateElement)

  }

  handlePainterChange = (stateName, index) => (evt) => {
    const newLabor = this.state.labor.map((labor, lIndex) => {
      if (index !== lIndex) return labor
      else {
        labor[stateName] = evt.target.value
        return labor
      }
    });
    
    this.setState({ labor: newLabor });
  }

  handleAddPainter() {
    this.setState({ labor: this.state.labor.concat([{name: '', weight: '', hours: ''}]) });
  }

  handleRemovePainter = (index) => () => {
    this.setState({ labor: this.state.labor.filter((labor, lIndex) => index !== lIndex) });
  }

  handleMaterialChange = (index) => (evt) => {
    const newMaterials = this.state.materials.map((material, mIndex) => {
      if (index !== mIndex) return material;
      return {...material, amount: evt.target.value };
    });
    
    this.setState({ materials: newMaterials });
  }

  handleAddMaterials() {
    this.setState({ materials: this.state.materials.concat([{amount: ''}]) });
  }

  handleRemoveMaterials = (index) => () => {
    this.setState({ materials: this.state.materials.filter((material, mIndex) => index !== mIndex) });
  }

  convertLaborToFloat() {
    return this.state.labor.map((item) => {
      return {name: item.name, weight: parseInt(item.weight, 10) / 100, hours: parseInt(item.hours, 10)}
    })
  }

  calculateJob() {

    let labor_info = this.convertLaborToFloat()
    let info = {
      job_total: parseFloat(this.state.job_total, 10),
      down_payment_percentage: parseInt(this.state.down_payment_percentage, 10)/100,
      materials: this.state.materials.map((material) => parseFloat(material.amount)),
      ct_split: parseInt(this.state.ct_split, 10)/100,
      sub_split: parseInt(this.state.sub_split, 10)/100,
      labor_info: labor_info
    }

    // console.log(info)
    jobCall.sendJobInfo(info).then(response => {
      this.setState({overall_costs: response.overall_costs, painter_rates: response.painter_rates})
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
              {this.state.materials.map((material, index) => (
                <div className="shareholder" key={index}>
                  <input
                    type="text"
                    placeholder={`${this.getIndexPhrase(index)} material`}
                    value={material.amount}
                    onChange={this.handleMaterialChange(index)}
                  />
                  <button type="button" onClick={this.handleRemoveMaterials(index)} className="small">Remove</button>
                </div>
              ))}
            <button type="button" onClick={this.handleAddMaterials} className="small">Add Materials</button>
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
              {this.state.labor.map((labor, index) => (
                <div className="shareholder" key={index}>
                  <input
                    type="text"
                    placeholder={`Name`}
                    value={labor.name}
                    onChange={this.handlePainterChange('name', index)}
                  />
                  <input
                    type="text"
                    placeholder={`Weight`}
                    value={labor.weight}
                    onChange={this.handlePainterChange('weight', index)}
                  />
                  <input
                    type="text"
                    placeholder={`Hours`}
                    value={labor.hours}
                    onChange={this.handlePainterChange('hours', index)}
                  />
                  <button type="button" onClick={this.handleRemovePainter(index)} className="small">Remove</button>
                </div>
              ))}
              <button type="button" onClick={this.handleAddPainter} className="small">Add Painter</button>
            </div>

          <button className="calculate-button" onClick={this.calculateJob}>Cal-culate. That. Job!</button>

          </div>
          <div className="right-side">
            <h3 className="underline">Results</h3>
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
