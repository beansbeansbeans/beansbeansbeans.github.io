# STRAWS

THE PROBLEM IS THAT I'M CONFUSING TWO COORDINATE SPACES - THE *CARTESIAN* AND THE *DRAWING* SPACES. THE INTERSECTION POINTS ARE CURRENTLY RECORDED IN *DRAWING* SPACE.

Need to define the coordinate space. 

It could be simply the area of the glass. Then for things to extend out of the glass, we'd just need some negative position values. 

The position of a straw could always be defined by its "bottom" and "angle" properties. 

bottom: {
	x: CSSLeftValue
	y: CSSTopValue
}

angle: CSSRotateZValue

# RELEASING

I shouldn't need to call release - it should just be an animation frame callback running from the get-go, that positions all floating straws. 