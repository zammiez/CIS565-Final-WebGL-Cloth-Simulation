var cfg;

(function() {
    'use strict';

    var Cfg = function() {
        // TODO: Define config fields and defaults here
        this.debugView = -1;
        this.debugScissor = false;
        this.enableEffect0 = false;
		this.bloomEffect = false;
		this.toonEffect = false;
		this.motionBlurEffect = false;
		this.scissor_test_optimization = true;
    };

    var init = function() {
        cfg = new Cfg();

        var gui = new dat.GUI();
        // TODO: Define any other possible config values
        gui.add(cfg, 'debugView', {
            'None':             -1,
            '0 Depth':           0,
            '1 Position':        1,
            '2 Surface Normal':  2,
            '3 Color map':       3,
			'4 Bloom source mask': 4,
			'5 Bloom blurred src': 5
        });
        gui.add(cfg, 'debugScissor');
		
		var opt0 = gui.addFolder('OPTIMIZATIONS');
		opt0.add(cfg,'scissor_test_optimization');
		
        var eff0 = gui.addFolder('POST EFFECTS');
        //eff0.add(cfg, 'enableEffect0');
		eff0.add(cfg, 'bloomEffect');
		eff0.add(cfg, 'toonEffect');
		//http://http.developer.nvidia.com/GPUGems/gpugems_ch21.html
		//https://docs.webplatform.org/wiki/tutorials/post-processing_with_webgl
		//http://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
		//http://webglfundamentals.org/webgl/lessons/webgl-image-processing-continued.html
		eff0.add(cfg, 'motionBlurEffect');
		//http://http.developer.nvidia.com/GPUGems3/gpugems3_ch27.html
        // TODO: add more effects toggles and parameters here
    };

    window.handle_load.push(init);
})();
