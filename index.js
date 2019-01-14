#!/usr/bin/env node

//importing dependencies
const figlet = require('figlet');
const chalk = require('chalk');
const args = process.argv;
const rl = require('readline');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const turl = require('turl');
const adapter = new FileSync('db.json')
const db = low(adapter)

//list of commands that will be accepted
const commands = ['new', 'get', 'remove', 'help'];

db.defaults({
    //creates a array named web_link that will store user inputs 
    web_links: []
}).write()

const prompt = question => {
    //This function will allows us to send messages from the terminal and accept input
    const r = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    return new Promise((resolve, error) => {
        //error handler
        r.question(question, answer => {
            r.close()
            resolve(answer)
        });
    });
}

console.log(figlet.textSync('Keylink', {
    //Display Keylink so user knows they are using the app
    font: 'Dr Pepper', //Doom'
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

const newLink = () => {
    //Will accpet link and turn it into a short link then pass it to the add name function
    const link_question = chalk.blue('Please enter a link\n');
    prompt(link_question).then(link => {
        //takes link_question and passed the value to link
        //link value is passed to turl.shorten to turn link user gave to short link
        let shortLink = turl.shorten(link).then((res) => {
            //short link saved in res the reassigned to shortLink variable
            shortLink = res;
            //shortLink value passed to addname() function
            return addname(shortLink)
        }).catch((err) => {
            //error handler
            console.log(err);

        });
    })
}

const addname = (linkName) => {

    //this function saves name and link to file
    let name = chalk.blue('please give your link a name example github for github.com\n');
    //Ask user give link a name
    prompt(name).then(newName => {
        //passes link name user gsve to newName
        db.get('web_links').push({
            //call the array inside the file and link and link name to it
            link: linkName,
            name: newName.replace(/\s/g, '')
        }).write()
        //Tells user link and name has been saved
        console.log(chalk.green("link and name saved!"));
    })


}

const getLink = () => {
    //Function get's links and names saved to file
    const linksList = db.get('web_links').value()
    let index = 1;
    linksList.forEach(link => {
        //loops over links in list and prints them to user with index
        let linktext = `${index++}. ${link.name}: ${link.link}`
        console.log(chalk.green(linktext));
    });
}

const remove = () => {
    // This will remove the link the user saved
    let question = chalk.blue("What is the name of the link you want to remove?\n");
    prompt(question).then(removeLink => {
        db.get('web_links').remove({
            name: removeLink.replace(/\s/g, '')
        }).write()
        console.log(chalk.green("link and name have been deleted!"));
    })
}

const help = () => {
    //print info and how to use app to the user
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
    //error handler
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
        remove()
        break

    default:
        errorLog(`only one argument can be accepted`);
        help()
}