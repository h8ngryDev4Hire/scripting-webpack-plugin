"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const child_process_1 = require("child_process");
class ScriptingWebpackPlugin {
    constructor(options) {
        this.scripts = options.scripts;
        this.shell = (options === null || options === void 0 ? void 0 : options.shell) || 'bash';
        this.bailOnScriptFailure = (options === null || options === void 0 ? void 0 : options.bailOnScriptFailure) || false;
        this.bailOnScriptStderr = (options === null || options === void 0 ? void 0 : options.bailOnScriptStderr) || false;
        this.verbose = (options === null || options === void 0 ? void 0 : options.verbose) || false;
        this.execOpts = {
            shell: (options === null || options === void 0 ? void 0 : options.shell) || 'bash',
        };
    }
    apply(compiler) {
        var _a, _b, _c;
        const shouldEmit = (_a = this.scripts) === null || _a === void 0 ? void 0 : _a.onShouldEmit;
        const emit = (_b = this.scripts) === null || _b === void 0 ? void 0 : _b.onEmit;
        const afterEmit = (_c = this.scripts) === null || _c === void 0 ? void 0 : _c.onAfterEmit;
        if (shouldEmit instanceof Array && shouldEmit.length > 0) {
            this.onShouldEmit(shouldEmit, compiler);
        }
        if (emit instanceof Array && emit.length > 0) {
            this.onEmit(emit, compiler);
        }
        if (afterEmit instanceof Array && afterEmit.length > 0) {
            this.onAfterEmit(afterEmit, compiler);
        }
    }
    run(scriptlet, options, compilation) {
        if (options === null || options === void 0 ? void 0 : options.async) {
        }
        if (!(options === null || options === void 0 ? void 0 : options.shell)) {
            options.shell = this.shell;
        }
        if (!(scriptlet === null || scriptlet === void 0 ? void 0 : scriptlet.shell)) {
            scriptlet.shell = options.shell;
        }
        let cmd = scriptlet.shell + ' ' + scriptlet.script;
        let argList;
        const args = scriptlet === null || scriptlet === void 0 ? void 0 : scriptlet.args;
        if (args && !(args instanceof Array || typeof args === 'string')) {
            //error out here
        }
        else if (args instanceof Array) {
            argList = args.join(' ');
            cmd += ' ' + argList;
        }
        else if (args) {
            cmd += ' ' + args;
        }
        if ((this === null || this === void 0 ? void 0 : this.verbose) || (scriptlet === null || scriptlet === void 0 ? void 0 : scriptlet.verbose)) {
            console.log(`executing following command string: ${cmd}`);
        }
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error) {
                const msg = `The following scriptlet, "${scriptlet.script}", failed: \n ${error}`;
                if (this.bailOnScriptFailure) {
                    throw new webpack_1.WebpackError(`Scripts: ${msg} `);
                }
                else {
                    console.error(msg);
                }
            }
            if ((this === null || this === void 0 ? void 0 : this.verbose) || (scriptlet === null || scriptlet === void 0 ? void 0 : scriptlet.verbose)) {
                console.log(stdout);
            }
            if (stderr) {
                if (this.bailOnScriptStderr) {
                    throw new webpack_1.WebpackError(`
							Scripts: scriptlet ${scriptlet.script} 
							stopped at following error msg: \n stderr`);
                }
                console.error(stderr);
            }
        });
    }
    onShouldEmit(scripts, compiler) {
        compiler.hooks.shouldEmit.tap('ScriptingWebpackPlugin', (compilation) => {
            try {
                if (scripts instanceof Array) {
                    scripts.forEach(scriptlet => {
                        this.run(scriptlet, this.execOpts, compilation);
                    });
                    // Should emit if all scriptlets ran successfully
                    return true;
                }
                else {
                    throw new webpack_1.WebpackError(`Scripts: 'scripts' must be a string Array type.`);
                }
            }
            catch (error) {
                compilation.errors.push(error);
                return false;
            }
        });
    }
    onEmit(scripts, compiler) {
        compiler.hooks.emit.tap('ScriptingWebpackPlugin', (compilation) => {
            try {
                if (scripts instanceof Array) {
                    scripts.forEach(scriptlet => {
                        this.run(scriptlet, this.execOpts, compilation);
                    });
                }
                else {
                    throw new webpack_1.WebpackError(`Scripts: 'scripts' must be a string Array type.`);
                }
            }
            catch (error) {
                compilation.errors.push(error);
            }
        });
    }
    onAfterEmit(scripts, compiler) {
        compiler.hooks.afterEmit.tap('ScriptingWebpackPlugin', (compilation) => {
            try {
                if (scripts instanceof Array) {
                    scripts.forEach(scriptlet => {
                        this.run(scriptlet, this.execOpts, compilation);
                    });
                }
                else {
                    throw new webpack_1.WebpackError(`Scripts: 'scripts' must be a string Array type.`);
                }
            }
            catch (error) {
                compilation.errors.push(error);
            }
        });
    }
}
module.exports = ScriptingWebpackPlugin;
