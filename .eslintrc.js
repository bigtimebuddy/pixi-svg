module.exports = {
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
    "rules": {
        "no-console": 0,
        "semi": [2, "always"]
    },
    "globals": {
        "PIXI": true
    },
    "env": {
        "browser": true,
        "node": true
    }
};