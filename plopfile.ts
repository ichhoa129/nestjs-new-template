import { NodePlopAPI } from "plop";

export default function (plop: NodePlopAPI) {
  plop.setGenerator("module", {
    description: "Module generation",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Please input your module name",
        validate: (input) => {
          const is_empty_response = Boolean(input && input.length !== 0);
          if (!is_empty_response) return "Name cannot be empty";
          if (/\s/g.test(input)) return "Name cannot contain whitespaces";
          if (!/^[a-zA-Z]+$/.test(input))
            return "Name should contain only english words";
          return true;
        },
      },
    ],
    actions: [
      "Creating meatball...Please wait" as any,
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/dto/create-one.ts",
        templateFile: "plop/module/dto/create-one.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/dto/update-one.ts",
        templateFile: "plop/module/dto/update-one.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/index.controller.ts",
        templateFile: "plop/module/index.controller.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/index.entity.ts",
        templateFile: "plop/module/index.entity.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/index.service.ts",
        templateFile: "plop/module/index.service.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/index.repository.ts",
        templateFile: "plop/module/index.repository.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/app/{{lowerCase name}}/index.module.ts",
        templateFile: "plop/module/index.module.txt",
        abortOnFail: true,
        skipIfExists: true,
      },
      "The meatball of a crazy Sweedish man has been created...along with your module.",
    ],
  });
}
