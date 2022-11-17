const { mdFileConverter } = require('./mdFileConverter');
const assert = require('assert');

describe('mdFileNewFeature', () => {
  it('test1', () => {
    let tempString = `# This is a testing sentence.`;
    let content = tempString.split(/\r?\n\r?\n/);

    let temp = ['<h1>This is a testing sentence.</h1>\n'];
    assert.deepEqual(mdFileConverter(content), temp);
  });

  it('test2', () => {
    let tempString = `## This is a testing sentence.`;
    let content = tempString.split(/\r?\n\r?\n/);

    let temp = ['<h2>This is a testing sentence.</h2>\n'];
    assert.deepEqual(mdFileConverter(content), temp);
  });

  it('test3', () => {
    let tempString = `### This is a testing sentence.`;
    let content = tempString.split(/\r?\n\r?\n/);

    let temp = ['<h3>This is a testing sentence.</h3>\n'];
    assert.deepEqual(mdFileConverter(content), temp);
  });

  it('test4', () => {
    let tempString = `This is a testing sentence.`;
    let content = tempString.split(/\r?\n\r?\n/);

    let temp = ['<p>This is a testing sentence.</p>\n'];
    assert.deepEqual(mdFileConverter(content), temp);
  });

  it('test6', () => {
    let tempString = `---`;
    let content = tempString.split(/\r?\n\r?\n/);

    let temp = ['<hr>\n'];
    assert.deepEqual(mdFileConverter(content), temp);
  });

  it('test6', () => {
    let tempString = `**This entire line should be bolded**.`;
    let content = tempString.split(/\r?\n\r?\n/);

    let temp = ['<p><strong>This entire line should be bolded</strong>.</p>\n'];
    assert.deepEqual(mdFileConverter(content), temp);
  });
});
