# express-tree

Hello and welcome to this technical assessment authored by Kat Chilton.

If you're a "show me the money" type, you can jump right to the good stuff, but please do come back and take the dev setup for a spin on your own machine. https://express-tree.onrender.com/

## Stack
- Node v20.10.0
- yarn@4.1.1
- express@4.19.2
- Cockroach Labs Cloud DB
- Prisma ORM
- TypeScript
- VueJS@3
- D3.js
- Winston/Morgan + customized logger
- Secured by Helmet
- Pug
- Google fonts
- Testing with Mocha/Chai/Supertest & Cypress
- Hosted by Render

## Usage
To run the app locally, you'll need access to the DB. You should have been provided with a `DATABASE_URL` which must be stored in an `.env` file at the project root, along with the port and web domain for the application server.

```
DATABASE_URL=<replace this with provided url>
PORT=3000
WEB_DOMAIN=http://localhost
```

### Node & Yarn versions
If your version of node is lagging behind, I strongly recommend using [**nvm**](https://formulae.brew.sh/formula/nvm)(`brew install nvm`) to switch between versions. This project uses the youngest node LTS, v20.

Additionally, it uses `yarn berry`, for its exceptional speed, but does not make use of PnP features. If you are not a yarn user, or are tied to an earlier version, you will need to run the following:

`corepack enable && yarn set version berry && yarn`

### Commands
`yarn` - Don't forget to install the deps\
`yarn dev` - Run the application in DEV mode\
`yarn prod` - Run the application in PROD mode\
`yarn test` - Run the test suite\
`yarn e2e` - Run e2e tests\
`yarn prisma:validate` - Validate the prisma schema\
`yarn prisma:generate` - Regenerate the prisma client (and types)\
`yarn prisma:studio` - Run the PrismaClient GUI

## Data structure

### Schema
The most concise structure seemed to be a single, self-relating entity, Leaf
```
model Leaf {
  name        String  @id @unique
  description String
  parentName  String?
  parent      Leaf?   @relation("LeafToLeaf", fields: [parentName], references: [name], onDelete: Restrict)
  children    Leaf[]  @relation("LeafToLeaf")
}
```

### ![Prisma GUI](./screenshots/Screenshot%202024-05-07%20at%2020.08.52.png)

The CockroachLabs DB is stored on a cluster in the cloud. The handiest way to see the underpinning data structure for yourself is to spin up prisma studio. There you can see all seven rows of Leaf data. The UI is not spectacular, but sometimes it greatly aids DX to visualize.

### Prisma type generation
When type generation is correctly provisioned, it can really add to developer momentum. With this setup, it is possible to **write the schema once, and derive all subsequent types from there.** All types are packed into the `@prisma/client`

### API response
As requested, the API returns a hierarchical structure, i.e. one root node which contains all its leaves in recursive children arrays.

## Express server

### Features
As requested, the backend is written in Express, with a couple of extra features. Custom logging is provided by `Winston` and `Morgan`, plus log rotation configuration. Various security features were provided by `Helmet` and `CORS`. Pug was adopted as the view engine toward the end as a simple way to pass `domain` and `port` variables through to the UI.

### Endpoints
`'/'` - Landing page for the tree\
`'/tree'` - GET request to retrieve the rows of leaves in a hierarchical structure\
`'/health'` - Used by Render to confirm a successful deployment\
`'/logs'` - Just for fun, visit the console and see

## Tree UI
The component function returned by `public/main.js` manages three main content states: `loading`, `error`, and a **D3 Tidy Tree**.

### D3.js
First pass the hierarchically shaped response to `d3-hierarchy`. This provides various additional properties to the payload, such as `height` and `depth` fields, which indicate the number of levels deep and an object's position in the tree, respectively. It also restructures the data around the relationship between parent and child, sweeping any additional fields into a `data` property. From there, use `d3-tree` to create the tree layout and derive the links between parents and their children. Lastly, `d3-shape` is called to create the link generating callback.

Instead of using `d3-selection` to traverse the DOM, I leveraged Vue's `v-for` directive to iterate over the data points and apply the link generating callback to `SVG path elements`. Leaves are represented with `circle elements`, which have `:hover` and `selected` states.

## Selection sidebar
Simple event listening and two-way data binding FTW! Plus a little sprinkling of transition animation which comes out of the box with Vue.

### Fluid design
VueJs watches the window size, and the SVG and CSS respond accordingly, rendering a very fluid transition from tablet- to desktop-sized screens. _Note: Vue does not react to opening and closing of the dev tools. If dev tools breaks the resonsive fluidity, please reload the page_

### Visual concepts
There are a couple of slight differences between parent and child, which make them more easily distinguishable. Theoretically this would aid in scanning larger plots of data.

The color scheme is Solarized Light.

## Testing

### ![Integration](./screenshots/Screenshot%202024-05-07%20at%2020.08.30.png)
Powered by chai, mocha, and supertest, integration testing ensures the server and api are healthy and returning successful responses. The easiest way to see the data structure returned by the API can be found in the `server/index.test.ts`.

### ![e2e](./screenshots/Screenshot%202024-05-07%20at%2020.06.43.png)
Fire up the server, visit the homepage, ensure all the elements are there. Additionally verify that clicking the leaves and the close button both update the sidebar.

## Thank you!
If you have read this far, congratulations! You are a true finisher. Thank you for your consideration.
