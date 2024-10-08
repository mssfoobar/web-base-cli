#!/usr/bin/env node

import { Command } from "commander";
import { mkdir, cp, rm, copyFile, writeFile, rmSync } from "fs";
import { promptPackageRoutes, type Module, getWorkingDirectory } from "./utils";
import { spinner, text } from "@clack/prompts";
import { exec, execSync } from "child_process";
import { exit } from "process";

let map: Map<string, any> = new Map([
  ["dash", { project: "aoh", url: "@mssfoobar/dash@0.0.1" }],
]);

const program: Command = new Command();

program
  .name("CLI")
  .version("1.0.0")
  .description(
    "This is the CLI to install modules onto your web-base framework"
  )
  .command("package")
  .action(async (_: string) => {
    let module: Module = await promptPackageRoutes();
    const libPath: string = `${module.lib}`;
    const org: string = "mssfoobar";

    let s = spinner();
    s.start("Copying files...");
    rmSync(`${module.web}/mod`, { recursive: true, force: true });

    //make a directory
    await mkdir(`${module.web}/mod`, (_) => (_ ? console.error(_) : null));

    //copy the necessary files over
    await cp(
      libPath,
      `${module.web}/mod/src/lib/${module.project}/${module.name}`,
      { recursive: true },
      (_) => (_ ? console.error(_) : null)
    );

    //Skip copying files if no input
    if (module.public) {
      const publicRoutePath: string = `${module.public}`;
      await cp(
        publicRoutePath,
        `${module.web}/mod/src/routes/(public)/${module.project}/${module.name}`,
        { recursive: true },
        (_) => (_ ? console.error(_) : null)
      );
    }

    if (module.private) {
      const privateRoutePath: string = `${module.private}`;
      await cp(
        privateRoutePath,
        `${module.web}/mod/src/routes/(private)/${module.project}/${module.name}`,
        { recursive: true },
        (_) => (_ ? console.error(_) : null)
      );
    }

    s.stop();

    //initialize package.json
    const packageFile = require(`${module.package}`);
    if (!packageFile.repository) {
      await text({
        message: "Repository not found. Please enter a repository url",
        defaultValue: "",
        validate: (value: string) => {
          if (!value) return "Please enter a repository url";
          packageFile.repository = {
            type: "git",
            url: value,
          };
        },
      });
    }

    let s1 = spinner();
    s1.start("initializing package.json");
    await setTimeout(() => {}, 100);
    delete packageFile["devDependencies"];
    delete packageFile["scripts"];

    packageFile.name = `@${org}/${module.name}`;
    packageFile.private = false;
    packageFile.publishConfig = {};
    packageFile.publishConfig[`@${org}:registry`] =
      "https://npm.pkg.github.com";
    writeFile(
      `${module.web}/mod/package.json`,
      JSON.stringify(packageFile, null, 2),
      (_) => (_ ? console.error(_) : null)
    );

    s1.message("publishing package...");
    let process = await exec(`npm publish ${module.web}/mod`, (_) => {
      if (_) {
        console.error(_);
        exit(0);
      }
    });

    process.on("close", (code) => {
      s1.stop(
        `Package "${module.name}" published to github successfully. You may now install using \`cli install ${module.name}\``
      );
    });
  });



//This is for installing a module
program
  .command("install")
  .argument("<module>")
  .action(async (module: string) => {
    if (!map.has(module)) {
      console.error(`Error: ${module} not found in the list of modules`);
      exit(0);
    }

    let root: string = await getWorkingDirectory();
    await text({
      message: "Please enter the path to your root folder",
      initialValue: `${root}`,
    });

    let project: string = map.get(module).project;

    let s = spinner();
    s.start("installing module...");
    setTimeout(() => {}, 5000);
    s.stop();

    s = spinner();
    s.start("installing dependencies...");
    let process = await exec(`npm install ${map.get(module).url}`, (exec) => {
      if (exec) console.log(exec);
      cp(
        `${root}/node_modules/@mssfoobar/${module}/src`,
        `${root}/src`,
        { recursive: true },
        (err) => {
          if (err) console.log(err);
        }
      );
    });

    process.on("close", (code) => {
      s.stop(`installing ${module} completed`);
    });
  });

program.parse();
