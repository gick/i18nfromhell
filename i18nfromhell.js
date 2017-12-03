const program = require('commander');
const { prompt } = require('inquirer');
const fs = require('fs')
var EventEmitter = require('events').EventEmitter;
var emit = new EventEmitter()

const cheerio = require('cheerio')
const HashMap = require('hashmap')
var map = new HashMap()

module.exports = {
    i18nfromhell: function(path) {
            fs.readFile(path, (err, data) => {
            	if(err){
            		console.log(err	)
            	}
                htmlDoc = cheerio.load(data)
                var that = this
                var toProcess = cheerio.load(htmlDoc('html body dom-module template').html())
                toProcess.root().find('*:not(:has(*))').each(function(i, elem) {
                    map.set(toProcess(elem).text(), elem.name)
                })
//                emit.emit('done')
            })
            return 'ok'

    },

    storeTagText: function(elem) {


    },

    getMap: function() {
        return map
    }
}