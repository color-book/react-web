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
      down_payment_percentage: '0',
      down_payment_amount: '0',
      materials: [{amount: ''}],
      ct_split: undefined,
      sub_split: undefined,
      labor: [{
        name: '', 
        weight: '', 
        hours: '', 
        rental: '', 
        reimbursement: '0',
        inTraining: false,
        trainedBy: ''
      }],
      overall_costs: {},
      painter_rates: [],
      costing_errors: {},
      error: false,
      errorMessage: ''
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
    this.roundResult = this.roundResult.bind(this);
    this.useDownPaymentPercentage = this.useDownPaymentPercentage.bind(this);
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
      else if (stateName === "inTraining") {
        let painters = this.state.labor.filter(painter => !painter.inTraining)
        labor[stateName] = !labor.inTraining
        if (labor.inTraining) labor['trainedBy'] = painters[0].name
        return labor
      }
      else {
        labor[stateName] = evt.target.value
        return labor
      }
    });

    this.setState({ labor: newLabor });
  }

  handleAddPainter() {
    this.setState({ labor: this.state.labor.concat([{name: '', weight: '', hours: '', rental: '', reimbursement: '0'}]) });
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
      return {
        name: item.name, 
        weight: parseInt(item.weight, 10) / 100, 
        hours: parseInt(item.hours, 10), 
        rental: parseFloat(item.rental),
        reimbursement: parseFloat(item.reimbursement),
        in_training: item.inTraining,
        trained_by: item.trainedBy
      }
    })
  }

  roundResult(value) {
    return Math.round(value  * 100) / 100
  }

  useDownPaymentPercentage() {
    let downPaymentPercentage = parseInt(this.state.down_payment_percentage, 10)
    let downPaymentAmount = parseInt(this.state.down_payment_amount, 10)
    let usePercentage = false

    if (downPaymentPercentage > 0 && downPaymentAmount === 0) {
      usePercentage = true
    }

    return usePercentage
  }

  calculateJob() {
    let downPaymentPercentage = parseInt(this.state.down_payment_percentage, 10)
    let useDownPaymentPercentage = this.useDownPaymentPercentage()
    let labor_info = this.convertLaborToFloat()
    let info = {
      job_total: parseFloat(this.state.job_total, 10),
      down_payment_percentage: downPaymentPercentage > 0 ? parseInt(this.state.down_payment_percentage, 10)/100 : downPaymentPercentage,
      down_payment_amount: parseInt(this.state.down_payment_amount, 10),
      use_down_payment_percentage: useDownPaymentPercentage,
      materials: this.state.materials.map((material) => parseFloat(material.amount)),
      ct_split: parseInt(this.state.ct_split, 10)/100,
      sub_split: parseInt(this.state.sub_split, 10)/100,
      labor_info: labor_info
    }

    if (info.ct_split + info.sub_split > 1) {
      this.setState({error: true, errorMessage: "Contractor and Sub Contractor splits combine to be greater than 100%"})
    } else {
      jobCall.sendJobInfo(info).then(response => {
        this.setState({
          overall_costs: response.overall_costs, 
          painter_rates: response.painter_rates,
          costing_errors: response.costing_errors
        })
      })
    }
  }

  render() {

    const {overall_costs, painter_rates, costing_errors} = this.state

    let options = this.state.labor.map((painter, index) => {
      if (!painter.inTraining) return <option key={index} value={painter.name}>{painter.name}</option>
      return ''
    })

    return (
      <div className="App">
        <h1>Job Calculator</h1>
        <div className="main">
          <div className="left-side">
            <h2 className="underline">Inputs</h2>
            <h3>General</h3>
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
              <label htmlFor="down-payment-amount-input">Down Payment Amount: </label>
              <input 
                type="text" 
                className="form-control" 
                id="down-payment-amount-input" 
                name="down-payment-amount" 
                onChange={this.handleInputChange.bind(null, 'down_payment_amount')}/>
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
            <div>
              <h3 htmlFor="materials-input">Materials </h3>
              <button type="button" onClick={this.handleAddMaterials} className="small">Add Materials</button>
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
            </div>

            <h3>Painters</h3>
            <div>
              {this.state.labor.map((labor, index) => (
                <div className="painters-box" key={index}>
                  <button type="button" onClick={this.handleRemovePainter(index)} className="small">Remove</button>
                  <div>
                    <label htmlFor="name">Name: </label>
                    <input
                      type="text"
                      value={labor.name}
                      name="name"
                      onChange={this.handlePainterChange('name', index)}
                    />
                  </div>
                  <div>
                    <label htmlFor="weight">Weight: </label>
                    <input
                      type="text"
                      value={labor.weight}
                      name="weight"
                      onChange={this.handlePainterChange('weight', index)}
                    />
                  </div>
                  <div>
                    <label htmlFor="hours">Hours: </label>
                    <input
                      type="text"
                      value={labor.hours}
                      name="hours"
                      onChange={this.handlePainterChange('hours', index)}
                    />
                  </div>
                  <div>
                    <label htmlFor="rental">Rental: </label>
                    <input
                      type="text"
                      value={labor.rental}
                      name="rental"
                      onChange={this.handlePainterChange('rental', index)}
                    />
                  </div>
                  <div>
                    <label htmlFor="reimbursement">Reimbursement: </label>
                    <input
                      type="text"
                      value={labor.reimbursement}
                      name="reimbursement"
                      onChange={this.handlePainterChange('reimbursement', index)}
                    />
                  </div>
                  <div>
                    <label htmlFor="inTraining">In Training: </label>
                    <input 
                      type="checkbox" 
                      name="inTraining" 
                      value={labor.inTraining}
                      onChange={this.handlePainterChange('inTraining', index)}  />
                  </div>
                  {labor.inTraining && <div>
                    <label>Trained By: </label>
                    <select onChange={this.handlePainterChange('trainedBy', index)}>{options}</select>
                  </div>}

                </div>
              ))}
            <button type="button" onClick={this.handleAddPainter} className="small">Add Painter</button>
          </div>

          <button className="calculate-button" onClick={this.calculateJob}>Calculate</button>

          </div>
          <div className="right-side">
            <h2 className="underline">Results</h2>
            {this.state.error && <div>{this.state.errorMessage}</div>}
            {(!this.state.error && painter_rates.length > 0) && <div>
              <h3>General</h3>
              <span>Down Payment: ${this.roundResult(overall_costs.down_payment)}</span><br/>
              <span>Materials Total: ${this.roundResult(overall_costs.materials_total)}</span><br/>
              <span>Labor: ${this.roundResult(overall_costs.labor)}</span><br/>

              <h3>Contractor Amounts</h3>
              <span>Gross Profit: ${this.roundResult(overall_costs.ct_split)}</span><br/>
              <span>Payout: ${this.roundResult(overall_costs.ct_split_final_payout)}</span><br/>

              <h3>Sub Contractor Amounts</h3>
              <span>Labor Payout: ${this.roundResult(overall_costs.sub_split)}</span><br/>
              <span>Remaining: ${this.roundResult(overall_costs.sub_split_left_over)}</span><br/>

              {costing_errors.errors && <div className="costing-error-message">{costing_errors.error_message}</div>}

              <h3>Painters</h3>
              {painter_rates.map((painter, index) => (
                <div className="painters-box" key={index}>
                  <span>Name: {painter.name}</span><br/>
                  <span>Hourly Average: ${this.roundResult(painter.hourly_average)}</span><br/>
                  <span>Hours: {painter.hours}</span><br/>
                  <span>Total Hours: {painter.total_hours}</span><br/>
                  <span>Weight: {parseFloat(painter.weight, 10) * 100}%</span><br/>
                  {painter.training_payout > 0 && <div><span>Training: ${this.roundResult(painter.training_payout)}</span><br/></div>}
                  <span>Payout: ${this.roundResult(painter.payout)}</span><br/>
                </div>
              ))}

            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
