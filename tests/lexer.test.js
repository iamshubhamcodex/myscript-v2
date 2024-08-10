const Tokenizer = require('../src/lexer/tokenizer');

function testTokenizer() {
    const input = `
    int a = 8;
    float b = 3.14;
    char c = 'c';
    String s = "s"
    `;
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();

    console.log(tokens);
}

testTokenizer();
