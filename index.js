#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const args = process.argv;



console.log(figlet.textSync('Welcome to Keylink', {
    font: 'Doom', //Dr Pepper'
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

const help = () => {

    const usageText = `keylink is a tools that lets you save links as short links in
    a json file that you can read and write to. 

    keylink <command> 

    commands can be 

    new:      used to add a new link
    get:      used to retrieve all links saved
    remove:   used to remove a link that is saves
    help:     used to print the usage guide

    `

    console.log(usageText);
}


const errorLog = error => {
    const elog = chalk.red(error);
    console.log(elog);
}

if (args.length > 3) {
    errorLog(`only one argument can be accepted`);
    help()
}