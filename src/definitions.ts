export type Shell = 'bash' | 'sh' | 'zsh' | 'node' | 'python'
type EmitEvent = 'after' | 'should' | 'before'


export interface ScriptingWebpackPluginOptions {
	scripts: ScriptSet;
	shell?: Shell;
	bailOnScriptFailure?: boolean;
	bailOnScriptStderr?: boolean;
	verbose?: boolean;
}


export interface PluginExecutionOptions {
	shell: Shell;
}


export interface Scriptlet {
	shell: Shell
	script: string;
	verbose?: boolean
	args?: Array<string> | string
} 


export interface ScriptSet {
	onShouldEmit?: Scriptlet[]	
	onEmit?: Scriptlet[]
	onAfterEmit?: Scriptlet[]
}

export interface ScriptRunOptions {
	shell?: Shell;
	async?: boolean;
}
