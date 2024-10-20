import { ScriptingWebpackPluginOptions, PluginExecutionOptions, Scriptlet, ScriptSet, ScriptRunOptions, Shell } from './definitions'
import  { Compilation, Compiler, WebpackError, WebpackPluginInstance } from "webpack";
import { exec, spawn, ExecException } from 'child_process'
import { promisify } from 'util'



class ScriptingWebpackPlugin implements WebpackPluginInstance {
	private scripts: ScriptSet;
	private shell: Shell 
	private execOpts: PluginExecutionOptions;
	private bailOnScriptFailure: boolean;
	private bailOnScriptStderr: boolean;
	private verbose: boolean;

	constructor(options : ScriptingWebpackPluginOptions) {
		this.scripts = options.scripts
		this.shell = options?.shell || 'bash'
		this.bailOnScriptFailure = options?.bailOnScriptFailure || false
		this.bailOnScriptStderr = options?.bailOnScriptStderr || false
		this.verbose = options?.verbose || false
		this.execOpts = { 
			shell: options?.shell || 'bash',

		}
	}

	apply(compiler : Compiler) {
		const shouldEmit = this.scripts?.onShouldEmit
		const emit = this.scripts?.onEmit 
		const afterEmit = this.scripts?.onAfterEmit

		if (shouldEmit instanceof Array && shouldEmit.length > 0) {
			this.onShouldEmit(shouldEmit, compiler)
		}

		if (emit instanceof Array && emit.length > 0) {
			this.onEmit(emit, compiler)
		}

		if (afterEmit instanceof Array && afterEmit.length > 0) {
			this.onAfterEmit(afterEmit, compiler)
		}
	}


	run( scriptlet : Scriptlet, options : ScriptRunOptions, compilation : Compilation ) {
			if (options?.async) {
					
			}

			if (!options?.shell) {
				options.shell = this.shell
			}

			if (!scriptlet?.shell) {
				scriptlet.shell = options.shell
			}

			let cmd = scriptlet.shell + ' ' + scriptlet.script
			let argList : string 
			const args = scriptlet?.args

			if (args && !(args instanceof Array || typeof args === 'string') ) {
				//error out here
			} else if (args instanceof Array) {
				argList =  args.join(' ')

				cmd += ' ' + argList
			} else if (args)  {
				cmd += ' ' + args 
			} 

			if (this?.verbose || scriptlet?.verbose) {
				console.log(`executing following command string: ${cmd}`)
			}
			 			
			exec(cmd, (
				error : ExecException | null , 
				stdout : string, 
				stderr : string
			) => {
				if (error) {
					const msg = `The following scriptlet, "${scriptlet.script}", failed: \n ${error}`

					if (this.bailOnScriptFailure) {
						throw new WebpackError(`Scripts: ${msg} `)
					} else {
						console.error(msg)
					}

				}

				if (this?.verbose || scriptlet?.verbose) {
					console.log(stdout)
				}

				if (stderr) {
					if (this.bailOnScriptStderr) {
						throw new WebpackError(`
							Scripts: scriptlet ${scriptlet.script} 
							stopped at following error msg: \n stderr`)
					}
					console.error(stderr)
				} 
			})

	}


 	onShouldEmit( scripts : Scriptlet[], compiler : Compiler ) {
		compiler.hooks.shouldEmit.tap('ScriptingWebpackPlugin', (
			compilation : Compilation
		)=>{
			try {
				if (scripts instanceof Array) {
					scripts.forEach( scriptlet => {
						this.run(scriptlet, this.execOpts, compilation)
					})

					// Should emit if all scriptlets ran successfully
					return true 
				} else {
					 throw new WebpackError(`Scripts: 'scripts' must be a string Array type.`)
				}
			} catch(error : WebpackError | any ) {
				compilation.errors.push(error)
				return false
			}
		})
	}

	onEmit( scripts : Scriptlet[], compiler : Compiler ) {
		compiler.hooks.emit.tap('ScriptingWebpackPlugin', (
			compilation : Compilation
		)=>{
			try {
				if (scripts instanceof Array) {
					scripts.forEach( scriptlet => {
						this.run(scriptlet, this.execOpts, compilation)
					})

				} else {
					 throw new WebpackError(`Scripts: 'scripts' must be a string Array type.`)
				}
			} catch(error : WebpackError | any ) {
				compilation.errors.push(error)
			}		
		})
	}

	onAfterEmit( scripts : Scriptlet[], compiler : Compiler ) {
		compiler.hooks.afterEmit.tap('ScriptingWebpackPlugin', (
			compilation : Compilation
		)=>{
			try {
				if (scripts instanceof Array) {
					scripts.forEach( scriptlet => {
						this.run(scriptlet, this.execOpts, compilation)
					})

				} else {
					 throw new WebpackError(`Scripts: 'scripts' must be a string Array type.`)
				}
			} catch(error : WebpackError | any ) {
				compilation.errors.push(error)
			}	
		})
	}

}


 module.exports = ScriptingWebpackPlugin
