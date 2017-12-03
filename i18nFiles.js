const fs = require('fs')
const HashMap = require('hashmap')
var map = new HashMap()
module.exports = {
    newTerm: function(lang, hashTerm, term) {
        map.set(hashTerm, [{ lang: lang, message: term }])
    },
    addTranslation: function(lang, hashTerm, term) {
        var current = map.get(hashTerm)
        current.push({ lang: lang, message: term })
        map.set(hashTerm, current)
        console.log(map.values())
    },
    generateLangs: function() {
        var langs = new HashMap()
        map.forEach(function(value, key) {
            value.forEach(function(term) {
                var termObject = {}
                termObject[key] = term
                langs.set({ key: key, lang: term.lang }, termObject)
            })
        })
        var toWrite
        langs.values().forEach(function(item){
            toWrite=toWrite+JSON.stringify(item)
        })
        fs.writeFile('message.txt', toWrite, 'utf8');
    }
}