import { ensureDir } from "fs-extra";

import { typesDirectoryName } from "../lib/settings";
import { readJson, writeJson } from "../util/io";
import { joinPaths } from "../util/util";

if (process.env.LONGJOHN) {
	console.log("=== USING LONGJOHN ===");
	const longjohn = require("longjohn");
	longjohn.async_trace_limit = -1; // unlimited
}

export const home = joinPaths(__dirname, "..", "..");

/** Settings that may be determined dynamically. */
export class Options {
	/** Options for running locally. */
	static defaults = new Options("../DefinitelyTyped", /*resetDefinitelyTyped*/ false, /*progress*/ true, /*parseInParallel*/ true);
	static azure = new Options("./DefinitelyTyped", /*resetDefinitelyTyped*/ true, /*progress*/ false, /*parseInParallel*/ false);

	/** Location of all types packages. This is a subdirectory of DefinitelyTyped. */
	readonly typesPath: string;
	constructor(
		/**
		 * e.g. '../DefinitelyTyped'
		 * This is overridden to `cwd` when running the tester, as that is run from within DefinitelyTyped.
		 */
		readonly definitelyTypedPath: string,
		readonly resetDefinitelyTyped: boolean,
		/** Whether to show progress bars. Good when running locally, bad when running on travis / azure. */
		readonly progress: boolean,
		/** Disabled on azure since it has problems logging errors from other processes. */
		readonly parseInParallel: boolean,
	) {
		this.typesPath = joinPaths(definitelyTypedPath, typesDirectoryName);
	}

	get fetchParallelism(): number { return 25; }
}

export function readDataFile(generatedBy: string, fileName: string): Promise<object> {
	return readFileAndWarn(generatedBy, dataFilePath(fileName));
}

/** If a file doesn't exist, warn and tell the step it should have bene generated by. */
export async function readFileAndWarn(generatedBy: string, filePath: string): Promise<object> {
	try {
		return await readJson(filePath);
	} catch (e) {
		console.error(`Run ${generatedBy} first!`);
		throw e;
	}
}

export async function writeDataFile(filename: string, content: {}, formatted = true): Promise<void> {
	await ensureDir(dataDir);
	await writeJson(dataFilePath(filename), content, formatted);
}

const dataDir = joinPaths(home, "data");
function dataFilePath(filename: string): string {
	return joinPaths(dataDir, filename);
}
