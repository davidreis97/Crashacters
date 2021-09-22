import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';
import { Crashacters } from './crashacters';
import { Insights } from './insights';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onShutdown(() => {
	insights?.dispose()
});

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}

	insights = Insights.getInstance();
});

interface RangeSetting {
	start: number,
	end: number
}

export interface CrashactersSettings {
	maxNumberOfProblems: number;
	characterBlacklist: {
		ranges: RangeSetting[]
	}
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: CrashactersSettings = {
	maxNumberOfProblems: 100,
	characterBlacklist: {
		ranges: [
			{
				start: 0,
				end: 8
			},
			{
				start: 11,
				end: 12
			},
			{
				start: 14,
				end: 31
			},
			{
				start: 127,
				end: 160
			},
			{
				start: 592,
				end: 8351
			},
			{
				start: 8368,
				end: 65535
			}
		]
	}
};
let globalSettings: CrashactersSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettingsCache: Map<string, Thenable<CrashactersSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettingsCache.clear();
	} else {
		globalSettings = <CrashactersSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<CrashactersSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettingsCache.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'crashacters'
		});
		documentSettingsCache.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettingsCache.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

const crashacters = new Crashacters();
let insights: Insights;
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	try{
		getDocumentSettings(textDocument.uri).then(
			settings => connection.sendDiagnostics({
				uri: textDocument.uri,
				diagnostics: crashacters.findCrashacters(textDocument, settings)
			}),
			error => insights?.reportCrash(error)
		);
	}catch(e){
		insights?.reportCrash(e as Error);
	}
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();