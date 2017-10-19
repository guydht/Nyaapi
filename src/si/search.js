const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')

const URI = require('./url.json').url

const _searchPage = (term, p, opts = {}) => {
  return new Promise((resolve, reject) => {
    axios.get(URI, {
      params: {
        f: opts.filter || 0,
        c: opts.category || '1_0',
        q: term,
        p: p
      }
    })
      .then(({data}) => {
        const $ = cheerio.load(data)
        const baseUrl = URI.slice(0, -1)
        const results = []

        const _getChild = (ctx, nb) => {
          return $(ctx).find(`td:nth-child(${nb})`)
        }

        $('tr').slice(1).each(function () {
          const toPush = {}

          // Scraping category
          toPush.category = {
            label: _getChild(this, 1).find('a').attr('title'),
            code: _getChild(this, 1).find('a').attr('href').replace('/?c=', '')
          }

          // Scraping names
          toPush.name = _getChild(this, 2).find('a:not(.comments)').text().trim()

          // Scraping links for torrent and magnet
          toPush.links = {
            page: baseUrl + _getChild(this, 2).find('a:not(.comments)').attr('href'),
            file: baseUrl + _getChild(this, 3).find('a:nth-child(1)').attr('href'),
            magnet: _getChild(this, 3).find('a:nth-child(2)').attr('href')
          }

          // Scraping some other info
          toPush.fileSize = _getChild(this, 4).text()
          toPush.timestamp = _getChild(this, 5).attr('data-timestamp')
          toPush.seeders = _getChild(this, 6).text()
          toPush.leechers = _getChild(this, 7).text()
          toPush.nbDownload = _getChild(this, 8).text()

          results.push(toPush)
        })

        resolve(results)
      })
      .catch((err) => reject(err))
  })
}

/**
 *
 * Research anything you desire on nyaa.si
 *
 * @param {string} term Keywords describing the research
 * @param {Object} opts Research options as described on the official documentation (optional)
 *
 * @returns {promise}
 */

const searchAll = (term = null, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    let page = 1
    let results = []
    let tmpData = []

    if (!term) {
      reject(new Error('[Nyaapi]: No search term was given.'))
    }

    if (typeof term === 'object') {
      term = term.term
    }

    try {
      tmpData = await _searchPage(term, page, opts)
    } catch (e) {
      reject(e)
    }

    while (tmpData.length && page < 15) {
      // We stop at page === 15 because nyaa.si offers a maximum of 1000 results
      // which means 14 pages of 75 results with the last one containing only 25.
      try {
        results = _.concat(results, tmpData)

        ++page
        tmpData = await _searchPage(term, page, opts)
      } catch (e) {
        reject(e)
      }
    }

    resolve(results)
  })
}

/**
 *
 * Research anything you desire on nyaa.si
 *
 * @param {string} term Keywords describing the research
 * @param {number} n Number of results wanted (Defaults to null)
 * @param {Object} opts Research options as described on the official documentation (optional)
 *
 * @returns {promise}
 */

const search = (term, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {

  })
}

/**
 *
 * Research anything you desire according to a certain user on nyaa.si
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {number} n Number of results wanted (Defaults to null).
 * @param {Object} opts Research options as described on the official documentation (optional).
 *
 * @returns {promise}
 */

const searchByUser = (user, term, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {

  })
}

module.exports = {
  search
}
