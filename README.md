# Serverless Node.js Starter

A Serverless starter that adds ES6, TypeScript, serverless-offline, linting, environment variables, and unit test support. Part of the [Serverless Stack](http://serverless-stack.com) guide.

[Serverless Node.js Starter](https://github.com/AnomalyInnovations/serverless-nodejs-starter) uses the [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle) plugin and the [serverless-offline](https://github.com/dherault/serverless-offline) plugin. It supports:

- **Generating optimized Lambda packages with Webpack**
- **Using ES6 or TypeScript in your handler functions**
- **Run API Gateway locally**
  - Use `serverless offline start`
- **Support for unit tests**
  - Run `npm test` to run your tests
- **Sourcemaps for proper error messages**
  - Error message show the correct line numbers
  - Works in production with CloudWatch
- **Lint your code with ESLint**
- **Add environment variables for your stages**
- **No need to manage Webpack or Babel configs**

---

### Demo

A demo version of this service is hosted on AWS - [`https://z6pv80ao4l.execute-api.us-east-1.amazonaws.com/dev/hello`](https://z6pv80ao4l.execute-api.us-east-1.amazonaws.com/dev/hello)

And here is the ES6 source behind it

``` javascript
export const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${(await message({ time: 1, copy: 'Your function executed successfully!'}))}`,
      input: event,
    }),
  };
};

const message = ({ time, ...rest }) => new Promise((resolve, reject) =>
  setTimeout(() => {
    resolve(`${rest.copy} (with a delay)`);
  }, time * 1000)
);
```

### Upgrading from v1.x

We have detailed instructions on how to upgrade your app to the v2.0 of the starter if you were using v1.x before. [Read about it here](https://github.com/AnomalyInnovations/serverless-nodejs-starter/releases/tag/v2.0).

### Requirements

- [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
- [Configure your AWS CLI](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

### Installation

To create a new Serverless project.

``` bash
$ serverless install --url https://github.com/AnomalyInnovations/serverless-nodejs-starter --name my-project
```

Enter the new directory

``` bash
$ cd my-project
```

Install the Node.js packages

``` bash
$ npm install
```

### Usage

To run a function on your local

``` bash
$ serverless invoke local --function hello
```

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

``` bash
$ serverless offline start
```

Deploy your project

``` bash
$ serverless deploy
```

Deploy a single function

``` bash
$ serverless deploy function --function hello
```

#### Running Tests

Run your tests using

``` bash
$ npm test
```

We use Jest to run our tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).

#### Environment Variables

To add environment variables to your project

1. Rename `env.example` to `.env`.
2. Add environment variables for your local stage to `.env`.
3. Uncomment `environment:` block in the `serverless.yml` and reference the environment variable as `${env:MY_ENV_VAR}`. Where `MY_ENV_VAR` is added to your `.env` file.
4. Make sure to not commit your `.env`.

#### TypeScript

If [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle) detects a `tsconfig.json` in your service root, it'll compile it using TypeScript.

#### Linting

We use [ESLint](https://eslint.org) to lint your code via [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle).

You can turn this off by adding the following to your `serverless.yml`.

``` yaml
custom:
  bundle:
    linting: false
```

To [override the default config](https://eslint.org/docs/user-guide/configuring), add a `.eslintrc.json` file. To ignore ESLint for specific files, add it to a `.eslintignore` file.

###Tokyo Server
  
  Access Key ID:  
  Secret Access Key:  
  tactic-admin
  
  tactics-admin    
  Cognito user pool  
  
###US East (N. Virginia)us-east-1
Access Key ID:
Secret Access Key:

aws cognito-idp sign-up \
  --region ap-northeast-1 \
  --client-id ap-northeast-1_DLPzunO1e \
  --username user1@tactics.com \
  --password Password.78


aws cognito-idp admin-confirm-sign-up \
  --region ap-northeast-1\
  --user-pool-id ap-northeast-1_DLPzunO1e \
  --username user1@tactics.com

tactics app client: tactics-app
app client id: 
PBE data site : https://www.surrenderat20.net/p/current-pbe-balance-changes.html



项目难产评估
开始时间:2020-apr-27
至今：2020-oct-10

服务器未完成：

英雄基础属性自动更新
武器基础属性自动更新
用户群权限设定
客户端版本校验（客户端数据版本是否与云数据库一致）
前端接口（未完全设计）

客户端未完成：
状态栏优化
ios适配问题
导航栏滑动收起 (David)
部件间保存状态（保存的数据形式）未设计 (David)

数据库未完成：
版本数据库（未设计）
武器数据库 (未设计)

爬虫框架：
爬虫发生机制 更新时间

需要demo代码：
多个异步函数协同问题
lambda函数获取json重命名并上传 (David)

数据库自动更新机制
AWS EC2 更新 (David)


Project structure (important lambda function only)
-- collector (no public access)
    -- crawler (david on progress)
    - getLatestVersionNumber (github to DB)
    - getLatestPatchJsonData (cdragon to DB & S3)
    
-- update (no public access)
    - updateChampionsBasicStats (s3 to DB)
    - updateItemBasicStats (s3 to DB)
    - updateComposition (crawler to DB)
    
-- api (public access with iam key)
    - getChampionPool (DB to frontend)
    - getItemStats (DB to frontend)
    - getCompositions (DB to frontend)
    - getPatchUpdateHistory (DB to frontend)
    
-- data-process (next version)
-- verification
-- utility

    - put object to s3
    - list all objects in s3
    - get obejct from s3
    
    - create new table
    
    - put object to table
    - update object in table
    - search object in table
    - delete object in table




Upcoming features:
- for batch update: (where table 'patch-version-history' and 'patch-data-history' only shows the active as true while others change to false)
- https://stackoverflow.com/questions/40478904/dynamodb-batch-update:
I know this is an old question by now, but DynamoDB recently added a Transaction api which supports update:
Update — Initiates an UpdateItem operation to edit an existing item's attributes or add a new item to the table if it does not already exist. Use this action to add, delete, or update attributes on an existing item conditionally or without a condition.
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html
