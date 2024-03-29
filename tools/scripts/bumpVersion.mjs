/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import nxDevkit from '@nx/devkit';
import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';

const { readCachedProjectGraph } = nxDevkit;

function invariant(condition, message) {
    if (!condition) {
        console.error(chalk.bold.red(message));
        process.exit(1);
    }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, version] = process.argv;

// clean up version input to use gitHub tags with v prefix.
const cleanVersion = version && version.replace('v', '');

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
    cleanVersion && validVersion.test(cleanVersion),
    `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`,
);

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
    project,
    `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`,
);

const projectRoot = project.data?.root;
invariant(
    projectRoot,
    `Could not find "build.options.project" of project "${name}". Is project.json configured  correctly?`,
);

process.chdir(projectRoot);

// Updating the version in "package.json"
try {
    const json = JSON.parse(readFileSync('package.json').toString());
    json.version = cleanVersion;
    writeFileSync('package.json', JSON.stringify(json, null, 2));
} catch (e) {
    console.error(
        chalk.bold.red(
            `Error reading package.json file from library "${name}".`,
        ),
    );
}
