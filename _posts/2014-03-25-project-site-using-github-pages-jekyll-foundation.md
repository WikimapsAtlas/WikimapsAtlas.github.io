---
title: Wikimaps Atlas website goes live
author: planemad
categories: [website]
tags: jekyll, github pages, foundation, markdown, website
layout: post
---

After some deliberation on wether to have a wordpress blog, we decided to stick with pushing all our code and documentation to one place for easier management and simplicity - [Github Pages](http://pages.github.com/). For those not aware, Github can host and serve a static website using the [jekyll](http://jekyllrb.com/) static blog engine. 

It requires a bit of documentation reading to understand how the different pieces work together, but for the terminally brave, this is but a minor skirmish. Here is the list of resources used to get our site running from scratch in a few hours:

* Setup [Git](https://help.github.com/articles/set-up-git) and create a [new repository](https://help.github.com/articles/create-a-repo)
* Start off with some [html5 boilerplate](http://html5boilerplate.com/)
* [Github Pages](http://pages.github.com/) to turn your repo into a freely hosted website
* Understand the basics of [Jekyll](http://jekyllrb.com/docs/home/) folder structure and concepts such as templates, layouts and includes
* Get familiar with the [Markdown Syntax](http://daringfireball.net/projects/markdown/basics) and how [Liquid Templates](http://docs.shopify.com/themes/liquid-basics) works.
* Read this great tutorial by [Andrew Munsell](https://www.andrewmunsell.com/tutorials/jekyll-by-example/tutorial) with step by step instructions on putting a jekyll site together
* [jekyll-bootstrap](https://github.com/plusjade/jekyll-bootstrap) for pieces of reusable code, especially if you want to use [bootstrap](http://getbootstrap.com/getting-started/) css framework. Also check out their well written [documentation on jekyll](http://jekyllbootstrap.com/lessons/jekyll-introduction.html) 
* Alternatively check out [Foundation](http://foundation.zurb.com/docs/) which is the framework we have used due to cleaner class names and documentation. We have also used the [Foundation icons](http://zurb.com/playground/foundation-icon-fonts-3) svg font pack for responsive icons.
* We also added [Disqus](http://disqus.com/websites/) for managing user comments on the posts
* Protip: Use [Bower](http://bower.io/) for easy frontend dependency management

For really advanced users who would like to use the slim templating system, sass and an asset pipeline along with jekyll, check out this tutorial by [Jason Fox](http://www.neverstopbuilding.com/jekyll-slim-compass-blog). We will probably get here as our site gets more complex in the future.

