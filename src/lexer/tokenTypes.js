const TokenType = {
  // Keywords
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",

  // Data Types
  INT: "INT",
  FLOAT: "FLOAT",
  CHAR: "CHAR",
  STRING: "STRING",

  // Operators
  PLUS: "PLUS",
  MINUS: "MINUS",
  MULTIPLY: "MULTIPLY",
  DIVIDE: "DIVIDE",
  ASSIGN: "ASSIGN",

  // Punctuation
  LPAREN: "LPAREN", // (
  RPAREN: "RPAREN", // )
  LBRACE: "LBRACE", // {
  RBRACE: "RBRACE", // }
  SEMICOLON: "SEMICOLON",

  // Other
  EOF: "EOF", // End of file/input
};

module.exports = TokenType;
