# Web Optimization (Project 4)

This is my take on the Udacity Front-End Nanodegree Project 4: Web Optimization.

The goals:

1. Get a Pagespeed score of 90 or above for index.html (on mobile and desktop)

2. Get a consistent frame rate of 60fps when scrolling on pizza.html

3. Get time to resize pizzas on pizza.html to less than 5ms

## Github

My code for this project is completely hosted on Github.

Github Repository: https://github.com/spinne/optimization

Github Pages: http://spinne.github.io/optimization/

#### File Structur of the Repository

Development Code:

The development code is completely inside the /dev folder. 


Production (Distribution) Code:

The production code is completely inside the /dist folder. Which is also the 
code found inside the gh-pages branch of the repository.


.publish Folder:

This is a result of gulp-gh-pages, which I used to publish the contents of the
/dist folder to my gh-pages branch.

#### Gulp
I've used Gulp to help me create and deploy my distribution code. I especially
used the gulp-gh-pages module to push my distribution code to the repository
gh-pages branch. I love it.
https://www.npmjs.com/package/gulp-inline-source

## How to Run the Project

  1. Use Github Pages
  
  There is a live version of the distribution code running publicly on
  Github Pages: http://spinne.github.io/optimization/

  
  2. Create Your Own Repository
  
  Download the ZIP from https://github.com/spinne/optimization .
  Unpack it in a folder on your local system.
  Create a git repository in your local folder (git init).
  Create an orphant gh-pages branch and remove all files from it.
  ( -> See: https://help.github.com/articles/creating-project-pages-manually/ )
  Get Node and Gulp up and running in your local folder.
  Install the gulp dependencies. Might be enough to just install gulp-gh-pages.
  Run 'gulp deploy' in the command line.
  The (distribution version of the) project should now run at:
  https://your-githup-username.github.io/your-repository
  
  
  3. Host On Any Webserver - In A Pinch!
  
  Download the ZIP from https://github.com/spinne/optimization .
  Unpack it in a local folder.
  Upload the contents of the /dist folder to a folder on your webserver (FTP?).
  Use a browser to navigate to the folder on your webserver.
  

## Optimizations

In order to achive the goals set out in the project specifications I used the 
Github Pages live version of my code and measured with Pagespeed Insights 
and the Google Chrome Developer Tools - Timeline.

 
### index.html

Goal: Get the Pagespeed score to 90 or above for both mobile and desktop.

##### CSS

At first I tried splitting the stylesheet into mobile and desktop versions
and applying media queries to the links. This approach works very well for
the print.css stylesheet - since it will only be accessed when the page is
printed.

But splitting the stylesheet resulted in two render blocking sources for 
mobile. Inlining only the small mobile stylesheet would still leave me
with a render blocking source. So I decided to keep the stylesheet together
in my development code and use gulp to inline the whole stylesheet at the
time of distribution.

Inlining the print.css stylesheet seems unnecessary because it is only 
accessed at certain times and would only bloat the distribution code. 

Using the media query on print.css and inlining style.css boosted the 
Pagespeed score.

##### Google Web Fonts

Instead of referencing the Google Web Font as stylesheet link in the head,
I used the Web Font Loader: https://github.com/typekit/webfontloader .
Which improved the Pagespeed score but leaves me with a short flash of
unstyled text onload. 

##### Javascript

I moved all javascript to the bottom of the body tag - including the new script
for the Web Font Loader - to unblock rendering. Putting the Web Font Loader in
head would still leave me with a render blocking javascript - and setting the
call to asynchronous (with the as async attribute) will throw an error because
the short inline script would execute before the libary is ready.

The analytics script and the perfmatters.js were set to async using the attribute.
Since analytics doesn't touch the dom and perfmatters only executes after the 
window.onload event - which fires after all asynchronous scripts are ready.

##### Images

I did most of the image optimization by hand using GIMP. I managed to get much
better results than only using Gulp to compress the images.

For example: I scaled the pizzaria.jpg down to 100px width, converted to png
with 8-bit color and managed to get from 2.25MB to 6.91kB. Instead of going
from 2.25MB to 2.02MB only using Gulp.

I did however run all my images (the ones I optimized by hand too) through a
gulp task so the final size for pizzaria.png is 6.63kB.

##### Results

Pagespeed score of http://spinne.github.io/optimization/ :

* Mobile: 95/100
* Desktop: 97/100

---------1---------1---------1---------1---------1---------1---------1---------1

### pizza.html and main.js

Goals:

* Get the Framerate down to 60fps when scrolling.
* Get the time to resize the pizzas to under 5ms.

##### 60fps

The main problem were the moving pizzas in the background of pizza.html.
Timeline showed that it took a very long time to calculate the new positions of
the 200 pizzas. But only a fraction of the pizzas were ever visible since they
had fixed positions.

###### main.js line 530 and below.

So I first decided to calculate the number of pizzas needed to cover the screen
instead of setting it at a fixed number. Each pizza moves within a field of 
256px width and 256px height, by using window.innerWidth and window.innerHeight
I could to calculate how many pizzas are needed to cover the whole screen. 
I used Math.ceil to round up the calculated number to include partially visible
rows and columns.

```
document.addEventListener('DOMContentLoaded', function() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var cols = Math.ceil(w / 256);
	var rows = Math.ceil(h / 256);
	var numberPizzas = cols * rows;
	...
```

I also moved the reference to the parent container outside the for-loop that
creates the pizza elements and included 

```
elem.style.willChange = 'left';
```

To move the background pizzas to their own composition layer.



##### Time to Resize



##### Images
  