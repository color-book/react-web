import axios from 'axios'

const baseUrl = 'http://localhost:5050'

export function sendJobInfo(jobInfo) {
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/calculate-job`, jobInfo)
    .then(response => {
      if (response.status === 200) {
        resolve(response.data)
      } else reject('nope..')
    })
  })
}

export function generatePDF() {
  return new Promise((resolve, reject) => {
    axios.get(`${baseUrl}/generate_pdf`, {headers: {'responseType': 'arraybuffer'}})
    .then(response => {
      if (response.status === 200) {
        resolve(response.data)
      } else reject('nope..')
    })
  })
}