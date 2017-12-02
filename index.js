const program = require('commander');
var inquirer = require('inquirer');
var Rx = require('rx-lite-aggregates');
const fs = require('fs')
const cheerio = require('cheerio')
const HashMap = require('hashmap')
var EventEmitter = require('events').EventEmitter;
var map = new HashMap();
var prompts = new Rx.Subject()
const i18nfromhell = require('./i18nfromhell')
const parseAndPresentResults = (file) => {

    i18nfromhell.i18nfromhell(file).on('done', () => {
        console.log(i18nfromhell.getKeys())
    })
    // i18.on('done',()=>{console.log(i18.getKeys())})
}

inquirer.prompt(prompts).ui.process.subscribe(
	(arg)=>{console.log(arg)}
);
  prompts.onNext({
    type: 'input',
    name: 'first_name',
    message: "What's your first name"
  });

  prompts.onNext({
    type: 'input',
    name: 'last_name',
    message: "What's your last name",
    default: function() {
      return 'Doe';
    }
  });

