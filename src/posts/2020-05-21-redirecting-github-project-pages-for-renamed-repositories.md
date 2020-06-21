---
title: Redirecting GitHub Project Pages for Renamed Repositories
date: 2020-05-21T02:00:00.000Z
excerpt: Most suggestions for handling redirects after renaming a GitHub repo
  are vastly insufficient. I found a much better solution.
categories:
  - programming
tags:
  - GitHub
  - web development
  - ""
---
I have recently finished a complete rewrite of my [DeviantArt Filter extension](/projects/deviantart-filter/), as deviantart.com was moving to an entirely new front-end. During the course of the rewrite, I realized the extension probably needed a proper site for documenting features, listing changes, etc.; prior to this, I just had a massive `README.md` in the [GitHub repository](https://github.com/rthaut/DeviantArt-Filter) that contained everything. I setup a Project Page for the repo (served out of the `/docs` directory), and things were great.

Then I had the bright idea to *rename* the GitHub repository. My reasoning (and subsequent struggles) are documented [in this GitHub issue](https://github.com/rthaut/deviantART-Filter/issues/139). Basically, when renaming a GitHub repository, GitHub changes the Project Page URL immediately to match the new name of the repository. This leads to broken links that were pointing to the old URL.

## The Problematic Suggestion(s)

The suggestions you will find online are to create a `<username>.github.io` repository, then create a folder matching the **old** repository's name in that repo, then create an `index.html` file within that directory that does a simple `<meta>` tag redirect. This works, but **only for links to the root** of your Project Page.

Here's an example of the process I used that **only partially worked**:

1. I renamed the repository from `deviantART-Filter` to `DeviantArt-Filter`
2. The Project Page URL was changed from https[]()://rthaut.github.io/*deviantART*-Filter/ to https[]()://rthaut.github.io/*DeviantArt*-Filter/
3. I created the `deviantART-Filter/index.html` file in a new `rthaut.github.io` repository and added a `<meta>` tag to redirect to https://rthaut.github.io/DeviantArt-Filter/
4. Visiting [https://rthaut.github.io/deviantART-Filter/](https://rthaut.github.io/deviantART-Filter/) redirected correctly to [https://rthaut.github.io/DeviantArt-Filter/](https://rthaut.github.io/DeviantArt-Filter/) 👍
5. **But visiting the latest release page on the old URL ([https://rthaut.github.io/deviantART-Filter/releases/v6.1.0/](https://rthaut.github.io/deviantART-Filter/releases/v6.1.0/)) showed a generic GitHub 404 page** 😰

In hindsight, this totally makes sense. That `deviantART-Filter/index.html` file is **only** served for requests to the root directory; other pages (and pages in sub-directories) are not handled by the `index.html` file.

## A Proper Solution

Using the `<username>.github.io` repository works, it just doesn't catch everything that needs to redirect. Thankfully, GitHub lets you create a custom 404 page that is served for all requests to missing content. So we just need to create a `404.html` file in the root of our `<username>.github.io` repository (*and remove that mostly-useless `index.html` file*). That `404.html` file then needs to capture the full URL, create the equivalent URL for the new repository, and perform the redirect.

Note that in order to actually get and manipulate the original request's URL, we have to use JavaScript; it is not as compatible as a simple `<meta>` tag redirect, but in 2020, the only people browsing without JavaScript enabled most likely intentionally have disabled it.

This is what I came up with (make sure you put it a `<script>` tag within the HTML of your `404.html` file):

``` js
var redirect = 'https://github.com/rthaut/';

var redirects = [{
    'regex': new RegExp('deviantart-filter', 'gi'),
    'replacement': 'DeviantArt-Filter'
}];

for (var i = 0; i < redirects.length; i++) {
    if (redirects[i].regex.test(window.location.href)) {
        redirect = window.location.href.replace(redirects[i].regex, redirects[i].replacement);
        break;
    }
}

document.write('Redirecting to ' + redirect);
window.location.replace(redirect);
```

First, I define the "default" redirect address, which is used for requests that are NOT explicitly redirected[^1].

Second, I create an array of redirect objects. I decided to use a Regular Expression, since that can do a case-insensitive match *without* converting the **entire** URL to lowercase (as the other parts of the URL need to retain casing).

Next, I loop through all configured redirects and test the current URL against the RegExp. If it matches, I replace the old repository's name (which is the matching part of the original URL) with the name of the new URL.

Finally, I write out a basic message to the page and use `window.location.replace()` to simulate a redirect (as opposed to a page change).

[^1]: This strategy *only* captures missing pages/URLs on your GitHub Pages subdomain, so the idea is that any **broken** links to https://`<username>`.github.io/... can be reasonably redirected to `<username>`'s GitHub profile page.