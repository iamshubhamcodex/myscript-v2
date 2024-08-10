const TokenType = require("./tokenTypes");

class Tokenizer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokens = [];
  }

  peek() {
    return this.input[this.position];
  }

  advance() {
    this.position++;
  }

  tokenize() {
    while (this.position < this.input.length) {
      const currentChar = this.peek();

      if (this.isWhitespace(currentChar)) {
        this.advance();
      } else if (this.isDigit(currentChar)) {
        this.tokenizeNumber();
      } else if (this.isLetter(currentChar)) {
        this.tokenizeIdentifier();
      } else if (currentChar === "'") {
        this.tokenizeChar();
      } else if (currentChar === '"') {
        this.tokenizeString();
      } else {
        this.tokenizeSymbol(currentChar);
      }
    }
    this.tokens.push({ type: TokenType.EOF, value: null });
    return this.tokens;
  }

  isWhitespace(char) {
    return /\s/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  tokenizeNumber() {
    let numStr = "";
    let isFloat = false;

    while (this.isDigit(this.peek()) || this.peek() === ".") {
      if (this.peek() === ".") {
        if (isFloat) {
          throw new Error(`Unexpected character: .`);
        }
        isFloat = true;
      }
      numStr += this.peek();
      this.advance();
    }

    if (isFloat) {
      this.tokens.push({ type: TokenType.FLOAT, value: parseFloat(numStr) });
    } else {
      this.tokens.push({ type: TokenType.INT, value: parseInt(numStr, 10) });
    }
  }

  tokenizeIdentifier() {
    let idStr = "";
    while (this.isLetter(this.peek())) {
      idStr += this.peek();
      this.advance();
    }

    const keywords = ["int", "float", "char", "String"];
    if (keywords.includes(idStr)) {
      this.tokens.push({ type: TokenType.KEYWORD, value: idStr });
    } else {
      this.tokens.push({ type: TokenType.IDENTIFIER, value: idStr });
    }
  }

  tokenizeChar() {
    this.advance(); // Skip opening quote
    const charValue = this.peek();
    this.advance();

    if (this.peek() !== "'") {
      throw new Error(
        `Unexpected character: expected ' after character literal`
      );
    }

    this.advance(); // Skip closing quote
    this.tokens.push({ type: TokenType.CHAR, value: charValue });
  }

  tokenizeString() {
    let strValue = "";
    this.advance(); // Skip opening quote

    while (this.peek() !== '"') {
      if (this.peek() === undefined) {
        throw new Error(`Unterminated string literal`);
      }
      strValue += this.peek();
      this.advance();
    }

    this.advance(); // Skip closing quote
    this.tokens.push({ type: TokenType.STRING, value: strValue });
  }

  tokenizeSymbol(currentChar) {
    switch (currentChar) {
      case "+":
        this.tokens.push({ type: TokenType.PLUS, value: currentChar });
        break;
      case "-":
        this.tokens.push({ type: TokenType.MINUS, value: currentChar });
        break;
      case "*":
        this.tokens.push({ type: TokenType.MULTIPLY, value: currentChar });
        break;
      case "/":
        this.tokens.push({ type: TokenType.DIVIDE, value: currentChar });
        break;
      case "=":
        this.tokens.push({ type: TokenType.ASSIGN, value: currentChar });
        break;
      case "(":
        this.tokens.push({ type: TokenType.LPAREN, value: currentChar });
        break;
      case ")":
        this.tokens.push({ type: TokenType.RPAREN, value: currentChar });
        break;
      case "{":
        this.tokens.push({ type: TokenType.LBRACE, value: currentChar });
        break;
      case "}":
        this.tokens.push({ type: TokenType.RBRACE, value: currentChar });
        break;
      case ";":
        this.tokens.push({ type: TokenType.SEMICOLON, value: currentChar });
        break;
      default:
        throw new Error(`Unexpected character: ${currentChar}`);
    }
    this.advance();
  }
}

module.exports = Tokenizer;
