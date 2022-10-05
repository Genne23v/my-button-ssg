const path = require("path");
const { version } = require('./package.json');
let fs = require('fs');

let argv = require('yargs/yargs')(process.argv.slice(2))
.usage('This is my simple program\nUsage: $0 [options]')
.help('help').alias('help', 'h')
.version('version', version).alias('version', 'v')
.alias('i', 'input')
.command("--input", "filename") 
.options({
  input: {
    alias: 'input',
    demandOption: true,
    default: ' ',
    describe: 'convert .txt file to html file',
    type: 'string'
  },
  output: {
    alias: 'o',
    demand: true,
    default: './dist',
    type: 'string'
  },
  lang: {
    alias: 'l',
    demandOption: true,
    default: '.',
    describe: 'generate the lang attribute',
    type: 'string'
  },
  config: {
    alias: 'c',
    demandOption: false,
    describe: 'specify path to config file with options',
    type: 'string'
  }
})
.argv;

// Check ./dist folder
if(fs.existsSync("./dist")){
  fs.rmSync("./dist",{recursive: true});
  fs.mkdir("./dist", err=>{
    if(err) throw err;
  });
} 
else{
fs.mkdir("./dist", err=>{
  if(err) throw err;
});
}

//Define variables
//let stats = fs.statSync(argv.input);
let tempHtml;
let footer = '© 2022 OSD600 Seneca';
let fileType ='';
let lang;
let inputPath = argv.input;
let configFilePath = argv.config;

if (configFilePath) {
  if (fs.existsSync(configFilePath) == false || fs.statSync(configFilePath).isDirectory()) {
    console.error("Invalid config file path");
    return;
  }

  try {
    let configFileData = fs.readFileSync(configFilePath);
    let configOptions = JSON.parse(configFileData);
    console.log(configOptions);
    return;
  } catch (parseError) {
    if (parseError instanceof SyntaxError) {
      console.error("Invalid JSON");
      return;
    }

    console.error(`Error while parsing config file: ${parseError}`);
  }
}

if(argv.lang == '.'){
  lang = "en-CA";
}else{
  lang = argv.lang;
}

let stats = fs.statSync(inputPath, argv.lang);

if(stats.isDirectory()){
  fs.readdirSync(inputPath).forEach(file =>{
  
    //Display all the files in the directory
    console.log("File name: ", file);
    fileType = file.split('.').pop(); 

    //Only convert the .txt file into a HTML file
    if(fileType === 'txt' || fileType === 'md'){
    fs.readFile(inputPath + "/"+ file.toString(), 'utf-8', function(err, fullText){
      if(err) return console.log(err);
      let fname = path.parse(file).name;
      //name the file without space
      let validFname = fname.split(' ').join('');

      let t = fullText.split(/\r?\n\r?\n/);
      //console.log("Title is :", t[0]);

      if(fileType == 'txt'){
      let content = t.slice(1,t.length);
      let html = content
          .map(para =>
            `\n<p>\n${para.replace(/\r?\n/, ' ')}\n</p> `
          ).join(' ');

      //HTML
      tempHtml = `<!doctype html>\n` + 
       `<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<title>${t[0]}</title>\n` +
       `\t<link rel="stylesheet" href="../src/css/style.css">\t\n</head>\n` +
       `<body>\n` + `<div class = "container">\n`+`<h1>${t[0]} </h1>\n` + `${html}` + `</div>\n\n` +
       `<footer> \n ${footer}\n</footer>\n</body> \n</html>`;
      }
      // Markdown for both # and ---
      else if(fileType == 'md'){
        let contents = fullText.split(/\r?\n\r?\n/);
     //   console.log(contents);   
     const html = [];   
     contents.forEach(e => {    
      if(e.includes('### ')) {
        html.push(`<h3>${e.replace('###', '').replace('---','<hr>')}</h3> <br />`);
      } else if(e.includes('## ')) {
        html.push(`<h2>${e.replace('##', '').replace('---','<hr>')}</h2> <br />`);
      } else if(e.includes('# ')) {
        html.push(`<h1>${e.replace('#', '').replace('---','<hr>')}</h1> <br /><hr /><br />`);
      } else {
        html.push(`<p>${e.replace(/\r?\n/, ' ').replace('---','<hr>')}</p> <br />`);
      }
    });  
    tempHtml =
    `<!doctype html>\n` +
    `<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<title>${t[0]}</title>\n` +
    `<link rel="stylesheet" href="../src/css/style.css">\n</head>\n` +
    `<body>\n` +
    `<div class = "container">\n` +
    `${html.join(' ')}` +
    `</div>\n</body>\n` +
    `<footer> \n ${footer}\n</footer>\n</html>`;
  }


    
    //Write file
    fs.writeFile(`./dist/${validFname}.html`, tempHtml, err=>{
      if(err) throw err;
      });
     })
    }


  })
  console.log('The HTML files have been saved to ./dist!');  
}

else{
  fileType = inputPath.split('.').pop(); 
  //console.log(fileType);

  //Only convert the .txt and .md file into a HTML file
  if(fileType === 'txt' || fileType === 'md'){
  fs.readFile(inputPath, 'utf8', function(err, fullText){
      if(err) return console.log(err);

      let fname = inputPath.split(".");
      //console.log(fname) //[ 'Silver Blaze', 'txt' ]
      let validFname = fname[0].split(' ').join('');
      
      if(fileType == 'txt'){

      let t = fullText.split(/\r?\n\r?\n/);
      //console.log("Title is :", t[0]);
      let content = t.slice(1,t.length);
      let html = content
          .map(para =>
            `\n<p><b>\n${para.replace(/\r?\n/, ' ')}\n</b></p> </br>`
          ).join(' ');
          
      //HTML   
      tempHtml = `<!doctype html>\n` + 
      `<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<title>${t[0]}</title>\n` +
       `\t<link rel="stylesheet" href="../src/css/style.css">\t\n</head>\n` +
       `<body>\n` + `<div class = "container">\n`+`<h1>${t[0]} </h1>\n` + `${html}` + `</div>\n\n` +
       `<footer> \n ${footer}\n</footer>\n</body> \n</html>`;
    } 
    else if(fileType == 'md'){
      
      let contents = fullText.split(/\r?\n\r?\n/);
      //console.log(contents);
      const html = [];
      
      contents.forEach(e => {
      if(e.includes('### ')) {
        html.push(`<h3>${e.replace('###', '').replace('---','<hr>')}</h3> <br />`);
      } else if(e.includes('## ')) {
        html.push(`<h2>${e.replace('##', '').replace('---','<hr>')}</h2> <br />`);
      } else if(e.includes('# ')) {
        html.push(`<h1>${e.replace('#', '').replace('---','<hr>')}</h1> <br /><hr /><br />`);
      } else {
        html.push(`<p>${e.replace(/\r?\n/, ' ').replace('---','<hr>')}</p> <br />`);
      }
  });
  
  tempHtml =
  `<!doctype html>\n` +
  `<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<title>${t[0]}</title>\n` +
  `<link rel="stylesheet" href="../src/css/style.css">\n</head>\n` +
  `<body>\n` +
  `<div class = "container">\n` +
  `${html.join(' ')}` +
  `</div>\n</body>\n` +
  `<footer> \n ${footer}\n</footer>\n</html>`;
  }  

    //Write file
      //console.log(validFname);
      fs.writeFile(`./dist/${validFname}.html`, tempHtml, err=>{
        if(err) throw err;
        console.log('The HTML file has been saved to ./dist!');  
      });
    });
  }
  else{
    fileType = 'Sorry, only .txt and .md files are allowed! Please try again!' //md
    console.log(fileType);
  }
}
