WebGL Cloth Simulation
--------------------------------------------

by: [Ziwei Zong](https://www.ziweizong.com)

* LinkedIn: [Ziwei Zong](https://www.linkedin.com/in/ziweizong)
* Twitter:  [@zzammie_zz](https://twitter.com/zammie_zz)

Overview
--------------------------------------------

Cloth Simulation using transform feedback for WebGL 2.0 supported browsers and ping-ponging texture method for browsers only supporting WebGL 1.0.

Using [Brandon Jones](https://github.com/toji)'s [WebGL 2 Particle Simulation](https://github.com/toji/webgl2-particles) as framework.

View online at [TODO:***]()

WebGL 2.0 version tested successfully on Chrome(Windows), Chrome Canary (Windows)
WebGL 1.0 version tested successfully on Chrome(Windows), Chrome Canary (Windows), FireFox (Windows)

![](Image/image.PNG)

**Feature:**

(1)Implementation of WebGL transform feedback cloth simulation and ping-pong texture method cloth simulation.

(2)Fabric Properties: Pins, pressure, hardness(bending strength), elastic etc.

(3)User interaction with cloth: drag, wind, tear etc.

**Implementation:**

11/16 - Overview Presentation : Basic setup and then start with ping-pong textures.

11/23 - MileStone 1 : WebGL 2 transform feedback.

11/30 - MileStone 2 : Implement fabric properties(pin,pressure, hardness,elastic, etc). (tbd)Environment Lighting.

12/07 - MileStone 3 : Implement user interaction with the cloth (drag, wind, tear etc). (tbd)Sewing seam line.

12/11 - Final : Optimization and Performance Analysis(*particle numbers/fps;*rigid-body interaction etc)
