const program = require('commander');
var path=require('path')
var inquirer = require('inquirer');
const hash = require('string-hash')
var parseDir=(path)=>{
	console.log(path)
	console.log(program.rawArgs)
}
program
    .version('0.1.0')
    .option('-C, --chdir <path>', 'change the working directory',parseDir)
    .option('-r, --recursive', 'List HTML files recursivly', 'marble')
    .parse(process.argv);

if (!program.chdir) {
    console.log('Please provide a dirctory')
    return
} else {
    console.log(program.directory)
    return
}


const fs = require('fs')
const cheerio = require('cheerio')
const HashMap = require('hashmap')
var EventEmitter = require('events').EventEmitter;
var map = new HashMap();
var currentLang = "en"
var initialLang = "fr"
var currentTranslations
var prompts = new Rx.Subject()
var fileArray = []
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
}


const saveLangs = (arg) => {
    if (arg)
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
        default: true
    });

}
listHTML = function(cmd, args, callBack) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function(buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack(resp) });
}


listHTML("find", ['.', '-maxdepth', '1', '-type', 'f', '-name', '*.html'], function(filepath) {
    if (filepath)
        fileArray.push(path.basename(filepath))
});



const addTranslation = (translation) => {
    i18nFiles.addTranslation(currentLang, hash(currentTranslations.shift()), translation)
}
//var h = i18nfromhell.i18nfromhell('/home/test/Dev/reveries-authoring-client/src/tutorial-view.html')

next = (arg) => {
    switch (arg.name) {
        case 'start':
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
    type: 'start',
    name: 'first',
    message: "Chose the lang to translate from",
    default: function() {
        return 'fr';
    }

});
prompts.onNext({
    type: 'checkbox',
    name: 'fileSelect',
    message: "Select file to i18n",
    choices: fileArray
});