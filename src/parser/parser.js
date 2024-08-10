// src/parser/parser.js

const TokenType = require('../lexer/tokenTypes');
const ASTNodeType = require('./astNodes');

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    peek() {
        return this.tokens[this.current];
    }

    advance() {
        this.current++;
    }

    match(...expectedTypes) {
        const currentToken = this.peek();
        if (expectedTypes.includes(currentToken.type)) {
            this.advance();
            return currentToken;
        }
        throw new Error(`Unexpected token: ${currentToken.type}`);
    }

    parse() {
        const programNode = {
            type: ASTNodeType.PROGRAM,
            body: [],
        };

        while (this.peek().type !== TokenType.EOF) {
            programNode.body.push(this.parseDeclaration());
        }

        return programNode;
    }

    parseDeclaration() {
        if (this.peek().type === TokenType.KEYWORD) {
            switch (this.peek().value) {
                case 'int':
                case 'float':
                case 'char':
                case 'String':
                    return this.parseVariableDeclaration();
                case 'void':
                case 'int':
                case 'float':
                case 'char':
                case 'String':
                    return this.parseFunctionDeclaration();
                default:
                    throw new Error(`Unexpected keyword: ${this.peek().value}`);
            }
        }

        throw new Error(`Unexpected token: ${this.peek().type}`);
    }

    parseVariableDeclaration() {
        const typeToken = this.match(TokenType.KEYWORD);
        const identifierToken = this.match(TokenType.IDENTIFIER);
        this.match(TokenType.ASSIGN);
        const valueNode = this.parseExpression();
        this.match(TokenType.SEMICOLON);

        return {
            type: ASTNodeType.VARIABLE_DECLARATION,
            varType: typeToken.value,
            id: identifierToken.value,
            value: valueNode,
        };
    }

    parseFunctionDeclaration() {
        const returnTypeToken = this.match(TokenType.KEYWORD);
        const identifierToken = this.match(TokenType.IDENTIFIER);
        this.match(TokenType.LPAREN);
        const params = this.parseParameters();
        this.match(TokenType.RPAREN);
        this.match(TokenType.LBRACE);
        const body = this.parseBlock();
        this.match(TokenType.RBRACE);

        return {
            type: ASTNodeType.FUNCTION_DECLARATION,
            returnType: returnTypeToken.value,
            id: identifierToken.value,
            params: params,
            body: body,
        };
    }

    parseParameters() {
        const params = [];
        while (this.peek().type !== TokenType.RPAREN) {
            const paramTypeToken = this.match(TokenType.KEYWORD);
            const paramIdToken = this.match(TokenType.IDENTIFIER);
            params.push({
                type: paramTypeToken.value,
                id: paramIdToken.value,
            });
            if (this.peek().type === TokenType.COMMA) {
                this.advance(); // Skip the comma
            }
        }
        return params;
    }

    parseBlock() {
        const statements = [];
        while (this.peek().type !== TokenType.RBRACE) {
            statements.push(this.parseDeclaration());
        }
        return {
            type: ASTNodeType.BLOCK,
            body: statements,
        };
    }

    parseExpression() {
        return this.parseBinaryExpression();
    }

    parseBinaryExpression() {
        let leftNode = this.parsePrimaryExpression();

        while (this.peek().type === TokenType.PLUS ||
               this.peek().type === TokenType.MINUS ||
               this.peek().type === TokenType.MULTIPLY ||
               this.peek().type === TokenType.DIVIDE) {
            const operatorToken = this.match(
                TokenType.PLUS,
                TokenType.MINUS,
                TokenType.MULTIPLY,
                TokenType.DIVIDE
            );
            const rightNode = this.parsePrimaryExpression();
            leftNode = {
                type: ASTNodeType.BINARY_EXPRESSION,
                operator: operatorToken.value,
                left: leftNode,
                right: rightNode,
            };
        }

        return leftNode;
    }

    parsePrimaryExpression() {
        const token = this.peek();
        if (token.type === TokenType.INT ||
            token.type === TokenType.FLOAT ||
            token.type === TokenType.CHAR ||
            token.type === TokenType.STRING) {
            this.advance();
            return {
                type: ASTNodeType.LITERAL,
                value: token.value,
            };
        }

        if (token.type === TokenType.IDENTIFIER) {
            this.advance();
            return {
                type: ASTNodeType.IDENTIFIER,
                value: token.value,
            };
        }

        if (token.type === TokenType.LPAREN) {
            this.advance(); // Skip '('
            const exprNode = this.parseExpression();
            this.match(TokenType.RPAREN); // Match ')'
            return exprNode;
        }

        throw new Error(`Unexpected token in expression: ${token.type}`);
    }
}

module.exports = Parser;
