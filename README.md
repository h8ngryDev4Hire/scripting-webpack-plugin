# Scripting Webpack Plugin

A simple webpack extension built in Typescript for running scripts during the emission phase in Webpack's compilation process. 

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)


## Features

### Scripting Language Support: 

Supports running bash / python / js script files! simply declare what shell to execute your script in!

### Event-based Execution

Supports running scripts based on different compiler hook events. Currently support compiler hooks are as follows:

- onShouldEmit (`compiler.hooks.shouldEmit`)
- onEmit (`compiler.hooks.emit`)
- onAfterEmit (`compiler.hooks.afterEmit`)


## Installation

### NPM Download 

To install from npm, run the following cmds:

```bash
npm i -D scripting-webpack-plugin
```

begin using in your `webpack.config.js` file as so:

```javascript
const ScriptingWebpackPlugin = require('scripting-webpack-plugin')
```

### Github Download

To install from github, run the following cmds:

```bash
git clone 


## Usage
A simple ScriptingWebpackPlugin configuration looks like the following: 

```javascript
const ScriptingWebpackPlugin = require('scripting-webpack-plugin')

// ...
// Your Webpack Configuration...
// ...

    plugins: [
        new ScriptingWebpackPlugin({
            scripts: {
                onEmit: [{
                    script: './scripts/build/chrome/build.sh',
                    args: 'target=chrome'
                },{
                    shell: 'node',
                    script: './scripts/build/chrome/crx.js'
                }],
                onShouldEmit: [{
                    script: './scripts/performance/performance.sh',
                    args: 'threshold=5000ms'
                }]
            },
            shell: 'bash',
            verbose: true
        })
    ]
```

you can refer to the example `webpack.config.js` build file for more help!

## Contributing

We welcome contributions to the project! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
