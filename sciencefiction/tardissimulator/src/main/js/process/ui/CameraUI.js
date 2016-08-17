define([ "ConsolePanel", "process/Action", "process/ui/SceneUI" ], function(ConsolePanel, Action, SceneUI)
{
    "use strict";
    var CameraUI = React.createClass(
    {
        getInitialState: function()
        {
            LOGGER.trace("CameraUI.getInitialState()");

            return (
            {
                camera: this.createCamera(),
            });
        },

        componentDidMount: function()
        {
            LOGGER.trace("CameraUI.componentDidMount()");

            this.setState(
            {
                renderer: this.createRenderer(),
            }, function()
            {
                LOGGER.info("setState completed function 1");
                this.createSceneUI();
            });
        },

        render: function()
        {
            LOGGER.trace("CameraUI.render()");

            InputValidator.validateNotNull("canvasId", this.props.canvasId);
            var canvasId = this.props.canvasId;

            return React.DOM.canvas(
            {
                id: canvasId,
            });
        },

        createCamera: function()
        {
            LOGGER.trace("CameraUI.createCamera()");

            InputValidator.validateNotNull("width", this.props.width);
            InputValidator.validateNotNull("height", this.props.height);

            var answer = new THREE.PerspectiveCamera(45, this.props.width / this.props.height, 0.1, 1000);

            answer.position.y = -120;
            answer.position.z = 30;
            answer.lookAt(new THREE.Vector3(0, 0, 0));

            return answer;
        },

        createRenderer: function()
        {
            LOGGER.trace("CameraUI.createRenderer()");

            InputValidator.validateNotNull("canvasId", this.props.canvasId);
            InputValidator.validateNotNull("width", this.props.width);
            InputValidator.validateNotNull("height", this.props.height);

            var canvasId = this.props.canvasId;
            var canvas = document.getElementById(canvasId);
            InputValidator.validateNotNull("canvas", canvas);

            var answer = new THREE.WebGLRenderer(
            {
                alpha: true,
                antialias: true,
                canvas: canvas,
            });

            answer.setClearColor(0x000000, 0);
            answer.setSize(this.props.width, this.props.height);

            return answer;
        },

        createSceneUI: function()
        {
            LOGGER.trace("CameraUI.createSceneUI()");

            var answer = new SceneUI(this.finishSceneUI.bind(this));

            return answer;
        },

        finishSceneUI: function(sceneUI)
        {
            LOGGER.trace("CameraUI.finishSceneUI() sceneUI = " + sceneUI);

            this.setState(
            {
                sceneUI: sceneUI,
            }, function()
            {
                LOGGER.info("setState completed function 2");

                if (this.state.renderer && this.state.sceneUI && this.state.camera)
                {
                    this.startRenderLoop();
                }
            });
        },

        render3D: function()
        {
            var renderer = this.state.renderer;
            var sceneUI = this.state.sceneUI;
            var camera = this.state.camera;

            renderer.render(sceneUI.scene(), camera);
        },

        startRenderLoop: function()
        {
            LOGGER.trace("CameraUI.startRenderLoop()");

            this.THREErender();
        },

        THREErender: function()
        {
            requestAnimationFrame(this.THREErender);

            var consolePanelKey = this.props.consolePanel.value;
            var values = ConsolePanel.values();
            var index = values.indexOf(consolePanelKey);
            var console = this.state.sceneUI.console();
            console.rotation.z = (index * -60.0) * Math.PI / 180.0;

            var timeRotor = this.state.sceneUI.timeRotor();
            var timeRotorDZ = this.props.timeRotorDZ;

            var z = timeRotor.position.z - (3.5 + 9);

            if (-11.5 > z || z > 0)
            {
                timeRotorDZ = -timeRotorDZ;
                this.context.store.dispatch(Action.setTimeRotorDZ(timeRotorDZ));
            }

            timeRotor.position.z += timeRotorDZ;
            timeRotor.rotation.y = (index * -60.0) * Math.PI / 180.0;

            this.render3D();
        },
    });

    CameraUI.contextTypes =
    {
        store: React.PropTypes.object.isRequired,
    };

    CameraUI.propTypes =
    {
        canvasId: React.PropTypes.string.isRequired,
        consolePanel: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        timeRotorDY: React.PropTypes.number.isRequired,
    };

    if (Object.freeze)
    {
        Object.freeze(CameraUI);
    }

    return CameraUI;
});