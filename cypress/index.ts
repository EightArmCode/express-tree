import concurrently from 'concurrently'

const { result } = concurrently([
  'yarn dev',
  'cypress run --browser chrome',
], {
  prefix: 'express-tree e2e testing with cypress',
  killOthers: [ 'failure', 'success' ],
})
result.then(
  onSuccess,
  onFailure,
)

function onSuccess() {
  process.exit(0)
}

function onFailure() {
  process.exit(1)
}
