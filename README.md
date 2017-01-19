# 🔥 Fire Starter

A simple, lightweight, modern asset pipeline. Uses Pug (Jade) for markup, Sass for styles, Babel for Javascript and Grunt to compile, optimize, serve and watch. Support for S3 bucket uploading and Cloudfront invalidation is included.

### What You Need

  * Mac OS X, Windows, or Linux
  * [Node.js](https://nodejs.org/) v6+
  * [npm](https://docs.npmjs.com/) v3+
  * [Ruby](https://www.ruby-lang.org/en/) and [Sass](http://sass-lang.com/)
  * Text editor or IDE configured for React/JSX/ESlint

### AWS Credentials

Bundled with this project in a `credentials.json.sample` file that should be renamed to `credentials.json` and edited so it contains the correct credentials. This file is gitignored by default.

### Dev Commands

**Installation**
```bash
# Install node modules - you only need to do this once :)
npm install
```

**Development**

```bash
# Starts a local server & watches for file changes
npm start
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

jQuery is included by default, but you [might not need it](http://youmightnotneedjquery.com/). To uninstall, just remove the dependency from `bower.json` and the _copy:jquery_ task (and references) in `Gruntfile.js`. Also delete the jQuery scripts near the bottom of `layout.pug`. If you don't need Bower either, you can delete that file all-together and remove the _check bower dependencies_ section of `Gruntfile.js` on lines **212-218**, as well as the _bower_ package from `package.json`.

### Don't Need AWS?

If you don't need AWS S3 and Cloudfront integration, just remove the _aws_ and _cloudfront_ tasks in `Gruntfile.js` on lines **228-257** as well as the _deploy_ task on line **263**. There is a _rename_ function on lines **156-158** that removes the _.html_ extension from files to make the S3 urls look nice. You can remove that, as well as the _grunt-aws_ package from `package.json`.

---
Built with ♥ at [Mcleod Studio](https://mcleod.studio)
