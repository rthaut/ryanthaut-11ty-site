---
title: Migrating to Jekyll
date: 2017-07-03 01:00:00
excerpt: I'm converting my personal website (a blog with a digital portfolio) from WordPress to a static site hosted on GitHub generated via Jekyll. These are my initial thoughts on the process and the result.
categories: programming
tags:
- web design
- web development
- blog
- ruby
- bootstrap

---
I'm honestly not entirely sure why. Probably because I wanted to learn something new. It also seems to align with my recent side projects pretty well. Whatever the reason, I am currently in the process of switching my blog from WordPress to [Jekyll](https://jekyllrb.com). This is not a how-to guide, or an article on the benefits of Jekyll over other blogging platforms; rather, this is simply my thoughts so far on the migration process and Jekyll in general.

## Finding Jekyll

I know I had heard of Jekyll before, but I don't remember ever actually looking into it at all. I had no idea how it worked, or what it was even designed to do, really. I happened upon it when looking for a simple CMS for working in Markdown. It wasn't even the [first result in my searches](https://duckduckgo.com/?q=static+blog+using+markdown).

However, once I did find Jekyll, I made up my mind very quickly to use it. It seemed both simple and powerful, it allowed me to code the site in HTML+CSS+JS while writing content in Markdown, and I could even "host" it on GitHub. That last point was probably the subconscious selling factor for me: I have been pushing myself to use GitHub as much as possible for my side projects, even the ones that really don't need to be open source, so this is just another thing to help me make that happen.

## Getting Started

Despite how simple it seemed to get going with Jekyll, there was some significant setup time. First, I knew I was going to "host" it on GitHub, which meant using [GitHub Pages](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/). That was actually quite simple to configure, but the downside was I would need to run it locally during initial development. I still use Windows as my primary OS. (Yes, I am very comfortable using Linux, but Adobe products do not work in Linux -- at least not well, and most of the PC games I play do not yet support [Vulkan](https://en.wikipedia.org/wiki/Vulkan_(API)).) Since Jekyll is built on Ruby, that meant [a few extra steps](https://rubyinstaller.org/) were needed before I could even start installing and configuring Jekyll itself.

## Customizing

These days I don't really spend any time at all *designing* websites. My professional career is almost exclusively enterprise cloud integrations development & consulting, so most of what I do is server-side. I occasionally get to do front-end development work, but that is almost always just building out a client's designs inside (or on top) of a cloud system. That said, I definitely still enjoy design work, so there was absolutely no way I was going to use one of the "standard" Jekyll themes (not that there's anything wrong with them).

I'm starting with basically just porting the WordPress theme I had created for my blog a few years ago, but rebuilding all of the HTML and CSS from scratch. Once I have that figured out, I may work on a proper redesign, but there are a few hurdles to get through first.

### Limitations of GitHub Pages

One of the fantastic features of using GitHub is that the Jekyll site is automatically regenerated whenever changes are pushed to the remote repository. Unfortunately, it seems GitHub has configured Jekyll to run in Safe Mode, which disables plugins. Additionally, you can use a package manager like [NPM](https://www.npmjs.com/) or [Bower](https://bower.io/) to maintain dependencies (like [Bootstrap](https://v4-alpha.getbootstrap.com/), [Primer CSS](http://primercss.io/), etc.), but you would have to upload the files your project is using to GitHub for them to be available in the Jekyll build process, which basically defeats the purpose of using a package manager.

I'm still working through exactly how I want to handle this. For now, I am including Bootstrap's CSS and JS files from their CDN, then my SASS file generates CSS rules for overriding Bootstrap. This is very much not ideal, but I also don't necessarily want to upload all of the Bootstrap SASS files (plus my modifications in `_custom.scss` and whatnot) to the repository.

Another possible solution to this conundrum is to run Jekyll locally to build the site, then upload the generated files to GitHub, rather than letting GitHub do that for you. That approach bothers me probably more than it should, so that will likely be my last-ditch option.

### Reinventing the Wheel

I suspect the process of switching to Jekyll could have taken me weeks (working here on there on evenings/weekends) had I tried to build and theme my site solely using the Jekyll documentation. The documentation itself isn't necessarily bad, but it is short on full examples of starting a new theme from scratch.

Thankfully, GitHub has a list of [projects using GitHub Pages](https://github.com/showcases/github-pages-examples), and many of them use Jekyll. That list provided a vast amount of examples and inspiration, which I found to be incredibly useful.
