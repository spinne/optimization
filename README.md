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

#### File Structure of the Repository

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
  Create an orphan gh-pages branch and remove all files from it.
  ( -> See: https://help.github.com/articles/creating-project-pages-manually/ )
  Get Node and Gulp up and running in your local folder.
  Install the gulp dependencies. Might be enough to just install gulp-gh-pages.
  Run 'gulp deploy' in the command line.
  The (distribution version of the) project should now run at:
  https://your-githup-username.github.io/your-repository
  
  
  3. Host On Any Web Server - In A Pinch!
  
  Download the ZIP from https://github.com/spinne/optimization .
  Unpack it in a local folder.
  Upload the contents of the /dist folder to a folder on your web server (FTP?).
  Use a browser to navigate to the folder on your web server.
  

## Optimizations

In order to achieve the goals set out in the project specifications I used the 
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

##### JavaScript

I moved all JavaScript to the bottom of the body tag - including the new script
for the Web Font Loader - to unblock rendering. Putting the Web Font Loader in
head would still leave me with a render blocking JavaScript - and setting the
call to asynchronous (with the as async attribute) will throw an error because
the short inline script would execute before the library is ready.

The analytics script and the perfmatters.js were set to async using the attribute.
Since analytics doesn't touch the DOM and perfmatters only executes after the 
window.onload event - which fires after all asynchronous scripts are ready.

##### Images

I did most of the image optimization by hand using GIMP. I managed to get much
better results than only using Gulp to compress the images.

For example: I scaled the pizzeria.jpg down to 100px width, converted to png
with 8-bit color and managed to get from 2.25MB to 6.91kB. Instead of going
from 2.25MB to 2.02MB only using Gulp.

I did however run all my images (the ones I optimized by hand too) through a
gulp task so the final size for pizzeria.png is 6.63kB.

##### Results

Pagespeed score of http://spinne.github.io/optimization/ :

* Mobile: 95/100
* Desktop: 97/100


### pizza.html and main.js

Goals:

* Get the Framerate down to 60fps when scrolling.
* Get the time to resize the pizzas to under 5ms.

###### All optimization were done in main.js

##### 60fps

The main problem were the moving pizzas in the background of pizza.html.
Timeline showed that it took a very long time to calculate the new positions of
the 200 pizzas. But only a fraction of the pizzas were ever visible since they
had fixed positions.

So I first decided to calculate the number of pizzas needed to cover the screen
instead of setting it at a fixed number. Each pizza moves within a field of 
256px width and 256px height, by using window.innerWidth and window.innerHeight
I could calculate how many pizzas are needed to cover the whole screen. 
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
	}
```

I also moved the reference to the parent container outside the for-loop that
creates the pizza elements and included the following in the for-loop: 

```
elem.style.willChange = 'left';
```

By giving the background pizzas the will-change CSS property they moved to 
their own composition layer. 

Then I changed the complicated process of calculating the new positions of the
pizzas in updatePositions() by removing the array creation for the pizzas and
the scrollTop lookup from the for-loop. The array length was also assigned
to a variable. All of which resulted in six lines of code for the new position
calculation and assignment.

```
function updatePositions() {
	...
	var items = document.getElementsByClassName('mover');
	var scroll = document.body.scrollTop;
	var len = items.length;
	
	for (var i = len; i--;) {
		items[i].style.left = items[i].basicLeft + 100 * Math.sin((scroll / 1250) + (i%5)) + 'px';
	}
	...
	}
```

###### Result: ...

##### Time to Resize

The calculation to resize the pizzas involved calls to a function (determineDx)
for every single pizza which would then return the new width of this pizza
container in pixel.

Instead of calculating the change within a for-loop for every pizza I moved
the calculations outside the loop and only used a for-loop to assign the
new width to all the pizzas.

By using percentage widths instead of pixel widths I could substitute all 
calculations with a simple switch inside a function:

```
function sizeSwitcher(size) {
	  switch(size) {
		  case '1':
		    return '25%';
		  case '2':
		    return '33.33%';
		  case '3':
		    return '50%';
		  default:
		    console.log('Bug in sizeSwitcher');
	  }
	}
```

This simply returns a string containing the percentage width. Assigning the
returned string to a variable I was able to simply iterate through the
pizzas (held in an array for one time lookup) and change their width:

```
var dx = sizeSwitcher(size);
var newwidth = dx;

for (var i = pizzasLength; i--;) {
  pizzas[i].style.width = newwidth;
}
```

Assigning the result of  the sizeSwitcher function to a new variable (newwidth)
is necessary - otherwise dx inside the loop would trigger a call to
sizeSwitcher() on every iteration.

##### Result: Time to resize is generally between 0.5ms - 0.7ms

##### Images & CSS

I added a simple scrset to the big pizzeria image in pizza.html and optimized 
the images accordingly. I also compressed the pizza.png image to 8-bit color.

And I used gulp to minify and inline the style.css into pizza.html.

Both things weren't really necessary but ...