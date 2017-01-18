## 🔥 Fire Starter
---

A simple, lightweight, modern asset pipeline. Uses Pug (Jade) for markup, Sass for styles, Babel for Javascript and Grunt to compile, optimize, serve and watch. Support for S3 bucket uploading and Cloudfront invalidation is included.

### Requirements

  * Mac OS X, Windows, or Linux
  * [Node.js](https://nodejs.org/) v7+
  * `npm` v3.10+ (new to [npm](https://docs.npmjs.com/)?)
  * [Ruby](https://www.ruby-lang.org/en/) and [Sass](http://sass-lang.com/)
  * Text editor or IDE pre-configured with React/JSX/Flow/ESlint

### AWS Credentials

Bundled with this project in a `credentials.json.sample` file that should be renamed to `credentials.json` and edited so it contains the correct credentials. This file is gitignored by default.

### Build & Dev

**Installation**
```bash
# Install node modules - this includes those for production and development
# You only need to do this once :)
npm install
```

**Development**

```bash
# Starts a local server & watches for file changes
npm run dev
```

**Deployment**

```bash
# AWS
npm run deploy
```

**Static Build**

```bash
# Builds static, optimized assets to the dist directory
npm run build
```

### Don't Need jQuery?

jQuery is included by default, but you [might not need it](http://youmightnotneedjquery.com/). To uninstall, just remove the dependency from `bower.json` and the _copy:jquery_ task (and references) in `Gruntfile.js`. Also delete the jQuery scripts near the bottom of `layout.pug`. If you don't need Bower either, you can delete that file all-together and remove the _check bower dependencies_ section of `Gruntfile.js` on lines *212-218*.

### Don't Need AWS?

If you don't need AWS S3 and Cloudfront integration, just remove the _aws_ and _cloudfront_ tasks in `Gruntfile.js` on lines *228-257* as well as the _deploy_ task on line *263*. There is a _rename_ function on lines *156-158* that removes the _.html_ extension from files to make the S3 urls look nice. You can remove that, as well as the _grunt-aws_ task from `package.json`.

---
Built with ♥ by [Mcleod Studio](https://mcleod.studio)
