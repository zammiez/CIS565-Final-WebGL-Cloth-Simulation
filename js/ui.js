
var UI_cfg = function () {

    var controls = {
        gui: null,
        "Cloth Dimension": 10,
        "Time Step": 0.003,
        "pause": false
    };

    controls.start = function () {
        var startEvent = new CustomEvent('start-simulation', null);
        window.dispatchEvent(startEvent);
    }

    controls.step = function () {
        var stepEvent = new CustomEvent('step-simulation', null);
        window.dispatchEvent(stepEvent);
    }

    this.getTimeStep = function () {
        return controls['Time Step'];
    }
    this.getClothDim = function () {
        return controls['Cloth Dimension'];
    };

    this.getPause = function () {
        return controls['pause'];
    }
    this.setPause = function (value) {
        controls['pause'] = value;
    }
    this.init = function () {
        //cfg = new Cfg();

        controls.gui = new dat.GUI();

        var propertyFolder = controls.gui.addFolder('propertyFolder');

        propertyFolder.add(controls, "Cloth Dimension");
        propertyFolder.add(controls, "Time Step");

        var actionFolder = controls.gui.addFolder('actionFolder');
        actionFolder.add(controls, "start");
        actionFolder.add(controls, "pause");
        actionFolder.add(controls, "step");


        propertyFolder.open();
        actionFolder.open();

    };
}
