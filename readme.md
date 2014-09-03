# DIRECTION 1 = GOING RIGHT, -1 = GOING LEFT

# DEBUGGING

There's serious problems with error margin going on. At certain places I'm depending on absolute precision, at certain places I'm depending on fuzziness. 

## thoughts

Once you intersect the glass, you can never stop intersecting the glass. 

Every frame, if you're intersecting the glass and there's room, you're going to change angle.

I still like the idea of limits.

Let's say you're intersecting the left corner and you change angle. This needs to immediately result in a change in start.x and start.y. 

The problem is that I haven't built a way for straws to get further away from boundaries, such as glass walls.

# ##############

# RELEASING STRAWS

## CONSTRAINTS OF MOVEMENT

- straw.top.y cannot be below straw.bottom.y

- straws cannot pass through glass walls

- once a straw has made contact with a glass wall, it may move along it (including crossing sides - e.g. from right to bottom) but it cannot rise above it

- (MAYBE NOT) at a certain me-defined rotation angle of the *glass*, the straws switch cases


## HOW STRAWS MOVE

- straws always try to move down (y++)

- after straw has made contact with a glass side, it's divided into two cases:
	- case 1: straw angle > -90
		- straw tries to move right
		- straw angle tries to get to 0
	- case 2: straw angle < -90
		- straw tries to move left
		- straw angle tries to get to -180


## EQUILIBRIUM

- when straw can no longer move in any direction while respecting constraints of movement


## MISCELLANEOUS IDEAS

- to create randomness, each straw could have a different rate of angle change


# ##############

# EACH FRAME

- Maybe there should be the concept of x and y bounds for each straw, and for top.x, top.y, bottom.x, bottom.y on each straw
	- straw.top.y = straw.top.y + 1 || straw.topYLimit
	- straw.top.x = straw.top.x + 1 || straw.topXLimit

- Every frame the rotation angle is first changed, then the limits are updated, and top and bottom x/y are recalculated
	- If given the new rotation angle top and bottom do not change, then rotation angle change is not persisted

- When the *glass* changes rotation, the limits are also updated.










