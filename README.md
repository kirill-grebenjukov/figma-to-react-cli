# Figma React CLI

Transform Figma UI into React components

## Problems

### 'center' constraints works in React-Native/Web differently than in Figma.

In Figma 'center' constraint maintains the object’s position, relative to the center of the frame.
In Figma it works like position widget on center and then move it on x (or y) value.
But in app, if we use flex, 'center' constraint and margin, margin will increase widget's size, 
and still position such bigger widget on center.
