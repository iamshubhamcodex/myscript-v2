// tests/parser.test.js

const Tokenizer = require('../src/lexer/tokenizer');
const Parser = require('../src/parser/parser');

function testParser() {
    const input = `
        int a = 10;
        float b = 5.5;
        char c = 'c';
        String name = "MyLanguage";
    `;
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    console.log(JSON.stringify(ast, null, 2));
}

testParser();
