const request = require('request-promise')

const { config } = require('./config.js')

/**
 * Request torrent information according to its ID.
 *
 * @param {number} id The ID of the torrent you want information of.
 *
 * @returns {promise}
 */

const infoRequest = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('[Nyaapi]: No ID given on request demand.'))
      return
    }

    request.get(`${config.url}view/${id}`)
      .then((data) => resolve(JSON.parse(data)))
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

module.exports = {
  infoRequest
}
