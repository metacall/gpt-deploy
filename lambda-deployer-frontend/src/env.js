const envVars = localStorage.getItem('env')
const keyValues = envVars.split('\n').map(line => line.split('=').map(item => item.trim()))
const env = Object.fromEntries(keyValues)
const process = { env2: env }
window.process = process
