#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const args = process.argv;
const rl = require('readline');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const turl = require('turl');
const adapter = new FileSync('db.json')
const db = low(adapter)

const commands = ['new', 'get', 'remove', 'help'];

db.defaults({
    web_links: []
}).write()

const prompt = question => {
    const r = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    return new Promise((resolve, error) => {
        r.question(question, answer => {
            r.close()
            resolve(answer)
        });
    });
}





console.log(figlet.textSync('Welcome to Keylink', {
    font: 'Doom', //Dr Pepper'
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));



const newLink = () => {




    const link_question = chalk.blue('Please enter a link\n');

    prompt(link_question).then(link => {
        // console.log("This is before short link", link);
        let shortLink = turl.shorten(link).then((res) => {
            // console.log(res);
            shortLink = res;
            // console.log("This is shortlink reassigned", shortLink);

            return addname(shortLink)




        }).catch((err) => {
            console.log(err);
        });

        console.log(chalk.green("link saved!"));



    })

}

const addname = (linkName) => {

    const name = chalk.blue('please give your link a name example github for github.com\n');

    prompt(name).then(newName => {

        db.get('web_links').push({
            link: linkName,
            name: newName


        }).write()



    })

}

const getLink = () => {
    const linksList = db.get('web_links').value()
    let index = 1;

    linksList.forEach(link => {
        let linktext = `${index++}. ${link.name}: ${link.link}`
        console.log(chalk.green(linktext));

    });
}


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

switch (args[2]) {
    case 'help':
        help()
        break

    case 'new':
        newLink()
        break

    case 'get':
        getLink()
        break

    case 'remove':
        break

    default:
        errorLog(`only one argument can be accepted`);
        help()


}