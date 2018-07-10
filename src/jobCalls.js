import axios from 'axios'

const baseUrl = 'http://localhost:5050'

export function sendJobInfo(jobInfo) {
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/calculate-job`, jobInfo)
    .then(response => {
      if (response.status == 200) {
        resolve(response.data)
      } else reject('nope..')
    })
  })
}