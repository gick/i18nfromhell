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
    },
    generateLangs: function() {
        var langs = new HashMap()
        map.forEach(function(value, key) {
            value.forEach(function(term) {
                var termObject = {}
                termObject.key = key
                termObject.message=term.message
                termObject.lang=term.lang
                langs.set({ key: key, lang: term.lang }, termObject)
            })
        })
        var toWrite = []

        langs.forEach(function(item,key) {
            toWrite.push({ message:item.message,lang: item.lang, key: item.key })
        })
        for (var i = 0; i < toWrite.length; i++) {
        console.log(toWrite[i])
            fs.writeFile(toWrite[i].lang + '.json',  toWrite[i].message, 'utf8');
        }
    }
}