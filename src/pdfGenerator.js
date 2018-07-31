import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";

function roundResult(value) {
  return Math.round(value  * 100) / 100
}

export function makePDF(jobInfo) {

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  let laborInfo = ''
  jobInfo.labor.forEach(painter => {
    laborInfo += `
      Name: ${painter.name}
      Weight: ${painter.weight}%, 
      Hours: ${painter.hours}, 
      Rental: $${painter.rental}, 
      Reimbursement: $${painter.reimbursement},
      Bonus: ${painter.add_bonus ? 'Yes' : 'No'},
      Revenue Bonus: ${painter.revenue_bonus ? 'Yes' : 'No'},
      Gross Profit Bonus: ${painter.gp_bonus ? 'Yes' : 'No'},
      Bonus Percentage: ${painter.bonus_percentage ? painter.bonus_percentage : '0'}%,
      In Training: ${painter.inTraining ? 'Yes' : 'No'},
      Trained By: ${painter.trainedBy ? painter.trainedBy : 'N/A'}
    `
  });

  let painterInfo = ''
  jobInfo.painter_rates.forEach(painter => {
    painterInfo += `
    Name: ${painter.name}
    Hourly Average: $${roundResult(painter.hourly_average)}
    Hours: ${painter.hours}
    Total Hours: ${painter.total_hours}
    Weight: ${parseFloat(painter.weight, 10) * 100}%
    Training Bonus: $${painter.training_payout > 0 ? roundResult(painter.training_payout) : '0'}
    Other Bonus Amount: $${painter.bonus_amount > 0 ? roundResult(painter.bonus_amount) : '0'}
    Payout: $${roundResult(painter.payout)}
    `
  })

  var docDefinition = {
    content: [
      {text: `Job Name: ${jobInfo.job_name}`, fontSize: 30},
      {
      columns: [
        {
          // auto-sized columns have their widths based on their content
          width: '50%',
          text: `
            Job Total: ${jobInfo.job_total}
            Down Payment: ${jobInfo.down_payment_percentage}%
            Contractor Split: ${jobInfo.ct_split}%
            Sub Contractor Split: ${jobInfo.sub_split}%

            Painters:
            ${laborInfo}
          `
        },
        {
          // auto-sized columns have their widths based on their content
          width: '50%',
          text: `
            Down Payment: $${roundResult(jobInfo.overall_costs.down_payment)}
            Materials Total: $${roundResult(jobInfo.overall_costs.materials_total)}
            Labor: $${roundResult(jobInfo.overall_costs.labor)}

            Contractor Amounts

            Gross Profit: $${roundResult(jobInfo.overall_costs.ct_split)}
            Payout: $${roundResult(jobInfo.overall_costs.ct_split_final_payout)}

            Sub Contractor Amounts

            Labor Payout: $${roundResult(jobInfo.overall_costs.sub_split)}
            Remaining: $${roundResult(jobInfo.overall_costs.sub_split_left_over)}

            Painters:
            ${painterInfo}
          `
        }
      ]
    }]
  };

  pdfMake.createPdf(docDefinition).download(`${jobInfo.job_name}.pdf`);
}
