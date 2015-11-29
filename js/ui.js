
var UI_cfg = function () {

    var getAnimationData = function () { };
    var controls = {
        gui: null,
        "Cloth Dimension": 10,
        "Time Step": 0.003
    };

    controls.start = function () {
        var startEvent = new CustomEvent('start-simulation', getAnimationData());
        window.dispatchEvent(startEvent);
    }

    this.getTimeStep = function () {
        return controls['Time Step'];
    }
    this.getClothDim = function () {
        return controls['Cloth Dimension'];
    };
    this.init = function () {
        //cfg = new Cfg();

        controls.gui = new dat.GUI();

        var aFolder = controls.gui.addFolder('a Folder');

        aFolder.add(controls, "Cloth Dimension");
        aFolder.add(controls, "Time Step");
        aFolder.add(controls, "start");

        aFolder.open();
    };
}
