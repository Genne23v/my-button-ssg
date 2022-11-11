var markdownit = require('markdown-it');

function mdFileConverter(content) {
  const html = [];
  // content.forEach(e => {
  //   if(e.includes('### ')) {
  //     html.push(`<h3>${e.replace('###', '').replace('---','<hr>')}</h3> <br />`);
  //   } else if(e.includes('## ')) {
  //     html.push(`<h2>${e.replace('##', '').replace('---','<hr>')}</h2> <br />`);
  //   } else if(e.includes('# ')) {
  //     html.push(`<h1>${e.replace('#', '').replace('---','<hr>')}</h1> <br /><hr /><br />`);
  //   } else {
  //     html.push(`<p>${e.replace(/\r?\n/, ' ').replace('---','<hr>')}</p> <br />`);
  //   }
  // });
  // Full Markdown support (e.g., swap out your basic version for an open source library/module that does it fully)
  let md = new markdownit();
  content.forEach((e) => {
    if (e) {
      html.push(md.render(e));
    } else {
      html.push(
        `<p>${e.replace(/\r?\n/, ' ').replace('---', '<hr>')}</p> <br />`
      );
    }
  });
  return html;
}

module.exports.mdFileConverter = mdFileConverter;
