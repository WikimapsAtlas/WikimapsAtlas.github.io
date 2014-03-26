# Setting up your development environment

The wikimaps atlas site is built using [Jekyll](http://jekyllrb.com/) and hosted via Github Pages. To test site changes locally, you will need to install the Jekyll gem (Requires [Ruby](http://gorails.com/setup/ubuntu/13.10))

    gem install jekyll

Clone the wikimaps-atlas repository and switch to the Github Pages branch

    git clone https://github.com/planemad/wikimaps-atlas.git
    cd wikimaps-atlas
    git checkout gh-pages
    
Start the jekyll server and watch for changes (Default location is 0.0.0.0:4000)

    jekyll serve --watch
    
## Directory structure

Read the [official documentation](http://jekyllrb.com/docs/structure/). Static assets including js files, stylesheets and other frontend components are in the /static folder.

## Writing a blog post

You can author a post in either markdown or html. Create a new .md or .html file in the /_posts folder with filename `YEAR-MONTH-DAY-title.MARKUP`

Include the following YAML front matter at the starting followed by your post content

```
---
layout: post
title: <title>
author: <author name>
categories: <comma separated list>
tags: <comma separated list>
---

And you can start writing your post content here...
```

See the [documentation](http://jekyllrb.com/docs/posts/) for advanced usage.


