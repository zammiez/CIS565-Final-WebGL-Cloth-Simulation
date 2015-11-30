
var UI_cfg = function () {

    var controls = {
        gui: null,
        "Cloth Dimension": 50,
        "Time Step": 0.003,
        "pause": false,
        "Wind": false,
        "Wind Force": 0.5
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

    this.getWindForce = function () {
        if (controls['Wind']) return controls['Wind Force'];
        return 0.0;
    }

    this.getPause = function () {
        return controls['pause'];
    }
    this.setPause = function (value) {
        controls['pause'] = value;
    }
    this.init = function () {
        //cfg = new Cfg();

        controls.gui = new dat.GUI();

        var Simulation_Settings = controls.gui.addFolder('Simulation_Settings');

        Simulation_Settings.add(controls, "Cloth Dimension");
        Simulation_Settings.add(controls, "Time Step");

        var Action_Folder = controls.gui.addFolder('Action_Folder');
        Action_Folder.add(controls, "start");
        Action_Folder.add(controls, "pause");
        Action_Folder.add(controls, "step");

        var Interaction_Folder = controls.gui.addFolder('Interaction_Folder');
        Interaction_Folder.add(controls,"Wind");
        Interaction_Folder.add(controls, "Wind Force");

        Simulation_Settings.open();
        Action_Folder.open();
        Interaction_Folder.open();

    };
}
