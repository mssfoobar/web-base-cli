import { exit } from "process";
import { exec } from "child_process";
import { promisify } from "util";
import { text, group, isCancel, confirm } from "@clack/prompts";
const execProm = promisify(exec);

export async function getGitRepoRoot(): Promise<string> {
  const command = "git rev-parse --show-toplevel";
  let path;
  try {
    const { stdout, stderr } = await execProm(command);
    path = stdout;
  } catch (error) {
    console.error(`Error: ${error}`);
    exit();
  }

  return path.trim(); // remove trailing newline
}

export async function getWorkingDirectory(): Promise<string> {
  let os = process.platform;
  const command: string = os === "darwin" || os === "linux" ? `pwd` : `cd`;
  let path;
  try {
    const { stdout, stderr } = await execProm(command);
    path = stdout;
  } catch (error) {
    console.error(`Error: ${error}`);
    exit();
  }

  return path.trim(); // remove trailing newline
}

export type Module = {
  name: string;
  project: string;
  web: string;
  lib: string;
  public?: string;
  private?: string;
  package: string;
};

export async function promptPackageRoutes(): Promise<Module> {
  const DEFAULT_PROJECT: string = "aoh";
  const cwd: string = await getWorkingDirectory();
  let package_name: string = "";
  let project_name: string = "";
  let web_route: string = "";

  const project = await group({
    name: async () =>
      await text({
        message: "Please enter the package name",
        validate: (value: string) => {
          if (isCancel(value)) exit(0);
          if (!value) {
            return "Please enter a package name";
          }

          package_name = value.replace("/", "");
        },
      }),
    project: async () =>
      await text({
        message: `Please enter the project name`,
        validate: (value: string) => {
          if (isCancel(value)) exit(0);
          if (!value) {
            return "Please enter a project name";
          }
          project_name = value.replace("/", "");
        },
      }),
    web: async () =>
      await text({
        message: "Please enter the path to your web folder (web)",
        initialValue: `${cwd}`,

        validate: (value: string) => {
          web_route = value;
        },
      }),
    package: async () =>
      await text({
        message: "Please enter the path to your web's package.json",
        initialValue: `${web_route}/package.json`,
      }),
    lib: async () =>
      await text({
        message: `Please enter the path to your lib folder`,
        initialValue: `${web_route}/src/lib/${project_name}/${package_name}`,
      }),
  });

  const havePublicRoute: boolean | symbol = await confirm({message: `Do you have public routes?`, inactive: 'No'});
  let publicRoute: string | symbol | undefined;
  if (havePublicRoute) {
    publicRoute = await text({
      message: `Please enter the path to your public routes.`,
      initialValue: `${web_route}/src/routes/(public)/${project_name}/${package_name}`,
    });

    if (isCancel(publicRoute)) exit(0);
  }

  const havePrivateRoute: boolean | symbol = await confirm({message: `Do you have private routes?`, inactive: 'No'});
  let privateRoute: string | symbol | undefined;
  if (havePrivateRoute) {
    privateRoute = await text({
      message: `Please enter the path to your private routes.`,
      initialValue: `${web_route}/src/routes/(private)/${project_name}/${package_name}`,
    });

    if (isCancel(privateRoute)) exit(0);
  }

  return {
    ...project,
    public: publicRoute as string,
    private: privateRoute as string,
  };
}
