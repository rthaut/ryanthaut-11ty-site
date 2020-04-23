---
title: 'PHP: Implode a Multidimensional Array'
date: 2013-09-12 23:47:58
excerpt: A deep dive into my solution for a niche problem wherein I needed to generate all possible sentences from an ordered arrays of words. 
categories: programming
tags:
- php
- programming
- web development
- words

---
I can't image this is a common problem, but I recently needed to implode a multidimensional array into all possible combinations for a [side project](https://www.managerisms.com). Since I may need to use this again (or maybe someone else needs something similar), I thought I would post my solution here and attempt to explain it.

## Final Result

Here is the final result for anyone just looking for the code:

``` php
<?
function multidimensional_implode($glue, $pieces) {
    $total = 1;
    foreach ($pieces as $piece)
        $total *= count($piece);

    $variations = array_fill(0, $total, array_fill(0, count($pieces), null));

    foreach ($pieces as $j => $piece) {
        $step = ceil((count($variations) / count($piece)) / (pow(count($piece), $j)));
        for ($i = 0; $i < count($variations); $i++) {
            $k = (floor($i / $step) % count($piece));
            $variations[$i][$j] = $pieces[$j][$k];
        }
    }

    foreach ($variations as $i => $variation)
        $variations[$i] = implode($glue, $variation);

    return $variations;
}
?>
```

Now that the copy-pasters have their code, the rest of us can dive in.

## Example Scenario

Imagine, if you will, that you had a sentence of three words, but each word had multiple options, like this:

| Position 1 | Position 2 | Position 3 |
| ---------- | ---------- | ---------- |
| man<br/>woman | likes | red<br/>green<br/>blue |
{ .table .table-striped .table-bordered}

Now imagine that your goal was to convert that into all possible 3 word sentence permutations like this:

| Position 1 | Position 2 | Position 3 |
| ---------- | ---------- | ---------- |
| man | likes | red |
| man | likes | green |
| man | likes | blue |
| woman | likes | red |
| woman | likes | green |
| woman | likes | blue |
{ .table .table-striped .table-bordered}

I realize that is a bit crazy, but hopefully it illustrates the point. It would obviously be easy to explode() the original string on the pipes to get array of length 3, and then you could explode() each of those 3 elements again (this time on the commas) to get a multidimensional array. However, it is much more complicated to take that multidimensional array and turn it into all possible combinations. Obviously we aren't looking for a solution specific to this example, but something that would work for any reasonable situation.

**Note:** assume from this point on that we are working with a multidimensional array that needs to be imploded()'d into all possible combinations.

## Getting Started

The first bit of useful information needed for a solution is: **how many possible variations are there?** Calculating that is trivial, similar to calculating how many unique license plate combinations a state can have. Simply multiply the number of options available for each position. So for the above example, we get: 2x1x3=6.

To do that with an array, we simply loop through the first dimension and multiply the number of elements in each position:

``` php
<?
$total = 1;
foreach ($pieces as $piece)
    $total *= count($piece);
?>
```

I then built out an empty array to iterate over, as it will simplify counting/looping later, but it is not necessary:

``` php
<?
$variations = array_fill(0, $total, array_fill(0, count($pieces), null));
?>
```

Now that we know how many variations there will be, we simply need to spread out the options into each position. **Except it is not simple at all.**

## Building Each Variation

Obviously we need to loop through each position of the first dimension of the array, so we have this as our base loop:

``` php
<?
foreach ($pieces as $position => $piece) {
    // code for each position
}
?>
```

### The Step Amount

If we go back to the original example or work through it logically, it is clear that of the 6 combinations, 3 will have "man" for the first word and the other 3 will all start with "woman." Additionally, it is clear that since there are 3 possibilities for the 3<sup>rd</sup> word, each of the 3 words will be in 2 sentences (one "man" and one "woman" for each word). From this we can deduce that **the number of variations built with each option for each position is directly related to the number of options for that position**. We calculate this by simply dividing the total number of variations by the number of options for that position. I call this the "step amount" because it says we will build this many variations using the first option before "stepping up" to the next option.

Using this information, we end up with the following basic division for the step amount:

``` php
<?
foreach ($pieces as $position => $piece) {
    $step = (count($variations) / count($piece));
}
?>
```

Unfortunately, the "step amount" cannot be the same for all of the positions because **that would lead to duplicates**. Using our example, you would end up with this:

| Position 1 | Position 2 | Position 3 |
| ---------- | ---------- | ---------- |
| man | likes | red |
| man | likes | red |
| man | likes | green |
| woman | likes | green |
| woman | likes | blue |
| woman |likes | blue |
{ .table .table-striped .table-bordered}

Since you went through the first option in steps of 3, you can't just go through the last word in steps of 2 (at least not linearly). To solve for this, we have to factor the position into our step amount calculation.

### The Scaled Step Amount

To keep things simple, we can step through the first position using the full step amount, since nothing else has been built out yet. However, the remaining words all need incrementally smaller step amounts so that each variation of the first position has all variations of the remaining position(s). Using our example, we can see that the third position actually needs to step by 1 option each time. Additionally, **it needs to reset** once it reaches the first statement built using the second available word. To accomplish this, we must divide the step amount by the number of available pieces, and this division must occur repeatedly for each position.

The best way I found to accomplish this was as follows:

``` php
<?
foreach ($pieces as $position => $piece) {
    $step = ceil((count($variations) / count($piece)) / (pow(count($piece), $position)));
    // code to assign each possible word into a variation
}
?>
```

This essentially takes our original step amount and divides it by a multiple of the amount of pieces available for the current position.

### Inserting Each Word into the Correct Variations

Now we are pretty much ready to start inserting words into the variations. Since we are looping through each position of the original multidimensional array, we now just need to loop through each variation so we can insert the words (i.e. from top to bottom, then left to right):

``` php
<?
foreach ($pieces as $position => $piece) {
    $step = ceil((count($variations) / count($piece)) / (pow(count($piece), $position)));
    for ($variation = 0; $variation < count($variations); $variation++) {
        // code to insert word into variation
    }
}
?>
```

At this point all that is left is to use the step amount to select the correct option from the original multidimensional array. To calculate that position, we simply divide which variation we are processing by the step amount and take the integer value of that quotient. This means that if our step value is 3 and there are 6 combinations, we will get something like this:

- 0.000... **(integer value: 0)**
- 0.333... **(integer value: 0)**
- 0.666... **(integer value: 0)**
- 1.000... **(integer value: 1)**
- 1.333... **(integer value: 1)**
- 1.666... **(integer value: 1)**

So you can see that if we use this calculated position as the index, we will take the first option 3 times and then the second option 3 times. As explained earlier, for the smaller step amounts we have to loop back to the beginning, so a simple modulus on the number of options available for the current position will keep us looping without hiccup. So this is how we calculate the position to pull from the original multidimensional array:

``` php
<?
$target = (floor($variation / $step) % count($piece));
?>
```

Putting it all together, our final loop is:

``` php
<?
foreach ($pieces as $position => $piece) {
    $step = ceil((count($variations) / count($piece)) / (pow(count($piece), $position)));
    for ($variation = 0; $variation < count($variations); $variation++) {
        $target = (floor($variation / $step) % count($piece));
        $variations[$variation][$position] = $pieces[$position][$target];
    }
}
?>
```

## Imploding the Variations

Now the simple part is to loop through all of our populated variations and implode them:

``` php
<?
foreach ($variations as $i => $variation)
    $variations[$i] = implode($glue, $variation);
?>
```

## Conclusion

It took me forever to figure out the scaled step amount, which is why I didn't fully explain the logic behind **why** we must raise the number of options to a power of the position. That alone could (and maybe should) be a separate post, but without the context, I don't think it could possibly be useful to anyone.

This solution performs reasonably well, but quickly blows up if you have lots of potential combinations. I haven't properly bench-marked it, but the only other alternative I found that "worked" was exponentially slower; it involved verifying a constructed combination was unique, which equates to programmatic guess-and-check, which is not a solution.
