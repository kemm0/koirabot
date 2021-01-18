const fs = require('fs')
const util = require('util')

const logError = (error) => {
  try{
    const d = new Date()
    const logMessage = '[' + d.toString() + ']' + JSON.stringify(error, null, 2) + '\n'
    fs.appendFile('./debug.log',logMessage, 'utf8',(err) => {
      if(err) throw err;
    })
  }
  catch(error){
    throw error
  }
}

module.exports = {
  logError
}