const _ = require('lodash')
const {h} = require('preact')

function render(data) {
  if (data.loading) {
    return '...'
  }
  return (
    <html>
      <body>
        <div>
          <h1>Tykki</h1>
          <p>Päivitetty: {new Date(data.projector.time)}</p>
          <p>Tila: {data.projector.status}</p>
          <p>Kuvasuhde: {data.projector.aspectRatio}</p>

          <h1>Vahvistin</h1>
        </div>
      </body>
    </html>
  )
}

module.exports = render
