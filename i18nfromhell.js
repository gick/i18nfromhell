const fs = require('fs')
const cheerio = require('cheerio')
const HashMap = require('hashmap')
const hash = require('string-hash')

var map = new HashMap()

module.exports = {
	//Takes a file path, parse it as html and update the map HashMap with
	//for each i18n candidates, the key hash(candidate) and the value [{ file: path, elem: elem, text: candidate }]
	// array allows to keep track of the same text used in differents context (file and/or elem)
    i18nfromhell: function(path) {
        htmlDoc = cheerio.load(fs.readFileSync(path, { encoding: 'utf-8' }))
        var toProcess = cheerio.load(htmlDoc('html body dom-module template').html())
        toProcess.root().find('.text').each(function(i, elem) {
            var text = toProcess(elem).text()
            hashtext = hash(text)
            if (map.has(hashtext)) {
                var newVal = map.get(hashtext)
                newVal.push({ file: path, elem: elem, text: text })
                map.set(hashtext, newVal)

            } else {
                if (text.length > 0)
                    map.set(hashtext, [{ file: path, elem: elem, text: text }])
            }
        })
    },

    i18nfiles: function(paths) {
    	paths.forEach((path)=>{this.i18nfromhell(path)})
    },

    getMap: function() {
        return map
    }
}

var paths=['/home/test/Dev/reveries-authoring-client/src/tutorial-view.html','/home/test/Dev/reveries-authoring-client/src/admin-view.html']
module.exports.i18nfiles(paths)
console.log(map.values())