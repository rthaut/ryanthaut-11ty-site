---
title: Migrating to Jekyll (Part 2)
date: 2019-03-09 20:00:00
excerpt: A follow-up post documenting some recent enhancements I have made to my site since first converting it from WordPress to Jekyll, focused mostly on moving from GitHub hosting to Netlify.
categories: programming
tags:
- web design
- web development
- blog
- jekyll
- ruby
- bootstrap

---
I guess this is Part 2 (or "The Sequel?") to my [post from 2017 on migrating to Jekyll](/blog/2017/07/02/migrating-to-jekyll "Migrating to Jekyll"), although when I wrote that original post I figured I would either follow up on it within a couple of months or I wouldn't follow up on it at all. Nevertheless, I have been making some changes lately to the site, and I wanted to make another post on it.

## New Services & Systems

### Forestry.io Static Site CMS

The first "change" I made was to add [Forestry.io as a CMS interface](https://forestry.io/ "Forestry.io"). It is a really neat (and **free**) system that acts as a CMS for static sites, but you aren't locked into using it. That means I can (and still do) write new posts and manage the site entirely from my IDE (through my GitHub repository), but now I also have an admin dashboard for managing content and a WYSIWYG editor for pages, posts, etc.

### Netlify Site Deployment

The next change I made, and definitely the more significant one, was to setup [Netlify for site deployment and hosting](https://www.netlify.com/ "Netlify") so I didn't have to use GitHub pages for the site (more on that later). Netlify is also free, but it provides a [plethora of useful features](https://www.netlify.com/features/ "Netlify Features"). For example: Netlify can automatically capture all form submissions, and you can setup email notifications and (even configure complex integrations) for those captured form submissions. Netlify also offers hooks into AWS Lambda, so a static site can still utilize server-side functionality where necessary.

## Leaving GitHub Pages

As I mentioned earlier, a big reason I moved to Netlify was so I could stop using [GitHub Pages](https://pages.github.com/ "GitHub Pages") for my blog. Don't get me wrong -- GitHub Pages are great, but there are some notable limitations. For me, not being able to use "unapproved" Jekyll plugins and Ruby gems was definitely a nuisance from day 1. However, the biggest gripe I had was that my GitHub Pages repository (`rthaut.github.io`, at the time) meant **I could not also have a project page for any of my other repositories.** When I first moved to GitHub pages, this wasn't even something I considered, but I recently revamped my [YouTube Popout Player browser extension](/projects/youtube-popout-player/ "YouTube Popout Player"), and I wanted to have a [dedicated page/site for it](http://rthaut.github.io/YouTubePopoutPlayer/ "YouTube Popout Player Official Site") to provide better documentation (instead of a giant `README.md`). With my personal site on Netlify now, I can have project pages for all of my GitHub repos (if I wanted/needed).

Being able to use any Jekyll plugin or Ruby gem is also beneficial. For example, [Forestry.io supports the `jekyll-menus` plugin](https://forestry.io/docs/editing/menus/ "Forestry.io Menus Documentation"), but that plugin is **not** approved for GitHub pages. On Netlify with that plugin I can now manage my site menus from my admin dashboard. Additionally, I am using the [Bootstrap Ruby gem](https://getbootstrap.com/docs/4.3/getting-started/download/#rubygems "Bootstrap RubyGems Documentation"), so gone are the days of having to commit the Bootstrap source files to my repository.

## Front-End Site Changes

### Showcasing My Projects

For years my main focus/priority for this site was showcasing [my design portfolio](/portfolio "My Deprecated Portfolio Page"). When I first migrated to Jekyll, however, I made the decision to **not** bring the portfolio items along. At the time I think the most recent item I had listed was still 3+ years old, and the older ones were probably closer to 6-7 years old. I had mostly stopped designing things around the time I finished my Bachelor's, and I realized it ~~was~~ might be time to stop promoting myself as a designer. (_Side note_: I still greatly enjoy designing things, I can just never seem to make it a priority...)

That said, I figured I have enough [polished/public side-projects](/projects/ "My Projects") to list them here instead of the portfolio page. My initial pass was to just put them all into a single HTML page, with links to their corresponding GitHub repositories. A few days later I revisited it, as my two main projects ([DeviantArt Filter](/projects/deviantart-filter/ "DeviantArt Filter") and [YouTube Popout Player](/projects/youtube-popout-player/ "YouTube Popout Player")) deserved dedicated pages were I could provide more than just a short summary. I created a custom collection for projects, which is very straight-forward in Jekyll, and the rest, they say, is history.

### Upgrading to Bootstrap 4.3

When I first started the process of switching to Jekyll, I used [Bootstrap 4](https://getbootstrap.com/ "Bootstrap Official Site")'s [Alpha 6](https://v4-alpha.getbootstrap.com/ "Bootstrap 4 Alpha 6 Documentation"). It was a very neat experience, as the switch from Less to Sass brought with it some frustrating problems, but it was also a significant improvement in general for the framework. Version 4.3 feels very polished, and includes some wonderful features, like the [stretched link component](https://getbootstrap.com/docs/4.3/utilities/stretched-link/ "Bootstrap Stretched Link Component Documentation"), which offers a way to make an entire "card" clickable.

### Lightbox for Images

This one is really minor, but with the introduction of my projects page, I once again had reason to put images on the site. Since lightboxes still seem to be a standard presentation mechanism for images, I went looking for a "modern" lightbox library. I was mostly concerned with finding one that didn't require a bunch of extra HTML markup (I'd rather the library to that automatically on-demand via JS). I settled on [Magnific Popup](https://dimsemenov.com/plugins/magnific-popup/), which is a perfect fit for my current needs and requirements.

## What's Next?

The short answer is: eventually something, but I don't know when. The work I do for my day job, while very enjoyable and rewarding, isn't really suitable for blog topics, nor can I really put any of it into a portfolio of some sort. So, at least for the foreseeable future, this site will continue to just be a simple [collection of my side projects](/projects/ "My Projects") and occasional blog posts.

However, I might explore [Hugo](https://gohugo.io/ "Hugo") as a replacement for Jekyll. While it doesn't have the extensive plugin community that Jekyll has (at least not yet), I definitely want to at least try out [Go](https://golang.org/ "The Go Programming Language"), and dropping Ruby (for local development) would be a nice improvement.
