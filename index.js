const program = require('commander');
var inquirer = require('inquirer');
const hash = require('string-hash')
var Rx = require('rx-lite-aggregates');
const fs = require('fs')
const cheerio = require('cheerio')
const HashMap = require('hashmap')
var EventEmitter = require('events').EventEmitter;
var map = new HashMap();
var currentLang = "en"
var initialLang = "fr"
var currentTranslations
var prompts = new Rx.Subject()
const i18nfromhell = require('./i18nfromhell')
const i18nFiles = require('./i18nFiles')
const parseFile = (lang) => {
    //currentFile=file
    initialLang = lang
    prompts.onNext({
        type: 'checkbox',
        message: 'Chose item to translate',
        name: 'choice',
        choices: i18nfromhell.getMap().keys()
    });


    // i18.on('done',()=>{console.log(i18.getKeys())})
}


const saveLangs=(arg)=>{
	if(arg)
		i18nFiles.generateLangs()
}

const choseLang = (choices) => {
    currentTranslations = choices
    prompts.onNext({
        type: 'input',
        name: 'langChosed',
        message: "Chose a lang to translate to",
        default: function() {
            return 'en';
        }
    });
}
const translate = (lang) => {
    currentLang = lang
    for (var i = 0; i < currentTranslations.length; i++) {
        i18nFiles.newTerm(initialLang, hash(currentTranslations[i]), currentTranslations[i])
        prompts.onNext({
            type: 'input',
            name: 'translated',
            message: "Translate : " + currentTranslations[i],
        });
    }

    prompts.onNext({
        type: 'confirm',
        name: 'saveLangs',
        message: "Enregistrer les json i18n?",
        default:true
    });

}

const addTranslation = (translation) => {
    i18nFiles.addTranslation(currentLang, hash(currentTranslations.shift()), translation)
}
var h = i18nfromhell.i18nfromhell('/home/test/Dev/reveries-authoring-client/src/tutorial-view.html')

next = (arg) => {
    switch (arg.name) {
        case 'first':
            parseFile(arg.answer)
            break
        case 'choice':
            choseLang(arg.answer)
            break
        case 'langChosed':
            translate(arg.answer)
            break
        case 'translated':
            addTranslation(arg.answer)
            break
        case 'saveLangs':
            saveLangs(arg.answer)
            break

    }
}

inquirer.prompt(prompts).ui.process.subscribe(
    (arg) => { next(arg) }
);
prompts.onNext({
    type: 'input',
    name: 'first',
    message: "Chose the lang to translate from",
    default: function() {
        return 'fr';
    }

});