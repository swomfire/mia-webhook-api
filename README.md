# mia-webhook-api
Node.js API Gateway - Messages webhook server

## Stack
- NodeJS
- Wit.ai
- FB Messenger

## Instruction
- Install packages

```
yarn
// or
npm install
```

- Build and Start Mia

```
yarn start
```

- If you wish to only build the chatbot itself. Use build command

```
yarn build
```

- Running Mia in dev mode

```
yarn dev
```

## Required Token
- FB_PAGE_TOKEN - Facebook Fanpage Token

  You can get FB_PAGE_TOKEN by follow the following steps
  1. Open App dashboard
  2. Under `Products` tab, select `Messenger`
  3. Searching for `Access Tokens` on `Messenger` product page
  4. Select a page you want to get token. If you haven't had any page yet, you can create new one

- FB_APP_SECRET - Facebook App Token

  You can get FB_APP_SECRET by follow the following steps
  1. Open App dashboard
  2. Navigate to `Settings` and then select `Basic`
  3. Click `Show` button on `App Secret` field to reveal the token


- WIT_TOKEN - Wit.ai **server** Token

  You can get WIT_TOKEN by follow the following steps
  1. Open your Wit.ai app dashboard
  2. Navigate to `Setting` screen by clicking `Setting` button on the **top right**
  3. Take a look at `API Details` and you will find your **Server token** of your app


## Architecture

- null
