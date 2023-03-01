import { Plugin, Project } from "@yarnpkg/core";
import {
  EngineChecker,
  EngineCheckerOptions,
  ErrorReporter,
  NodeEngineChecker,
  YarnEngineChecker,
} from "./engine-checkers";

function verifyEngines(errorReporter: ErrorReporter) {
  return function (project: Project): void {
    if (process.env.PLUGIN_YARN_ENGINES_DISABLE != null) {
      return;
    }

    const { selfEngines = {}, engines = {} } = project.getWorkspaceByCwd(project.cwd).manifest.raw;
    const options: EngineCheckerOptions = { project, errorReporter };
    const engineCheckers: EngineChecker[] = [new NodeEngineChecker(options), new YarnEngineChecker(options)];
    engineCheckers.forEach((engineChecker) =>
      engineChecker.verifyEngine(Object.keys(selfEngines).length ? selfEngines : engines)
    );
  };
}

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEngines(ErrorReporter.Yarn),
    setupScriptEnvironment: verifyEngines(ErrorReporter.Console),
  },
};

export default plugin;
