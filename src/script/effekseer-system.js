/*jshint esversion: 6, asi: true, laxbreak: true*/

class PlayCanvasEffekseerSystem
{
    constructor(app) {
        this.context = effekseer.createContext();     
        this.context.init(app.graphicsDevice.gl); 
    }
    
    release()
    {
        effekseer.releaseContext(this.context);
    }
}

window.playCanvasEffekseerSystem = null;
window.playCanvasEffekseerSystemCount = 0;

window.createPlayCanvasEffekseerSystem = function(app) {
    if(window.playCanvasEffekseerSystemCount === 0)
    {
        window.playCanvasEffekseerSystem = new PlayCanvasEffekseerSystem(app);
    }
    window.playCanvasEffekseerSystemCount += 1;
};

window.deletePlayCanvasEffekseerSystem = function() {
    window.playCanvasEffekseerSystemCount -= 1;
    if(window.playCanvasEffekseerSystemCount === 0)
    {
        window.playCanvasEffekseerSystem = null;
    }
};


var EffekseerSystem = pc.createScript('effekseerSystem');

EffekseerSystem.prototype.initialize = function() {
    
    window.createPlayCanvasEffekseerSystem(this.app);
    
    var theObj = this;
    var layer = new pc.Layer({
        name : "effekseerlayer",
            onPostRenderTransparent : function (camerapass) {
                window.playCanvasEffekseerSystem.context.draw();
            }
        });
    
    this.layer = layer;
        
    var worldLayer = this.app.scene.layers.getLayerByName("World");
    var idx = this.app.scene.layers.getTransparentIndex(worldLayer);
    this.app.scene.layers.insertTransparent(layer, idx + 1);
    
     
    // add layer to a camera
    var camera = this.app.root.findByName('camera').camera;
    var layers = camera.layers.concat();
    layers.push(layer.id);
    camera.layers = layers;
    
    this.on("destroy", function () {
        window.deletePlayCanvasEffekseerSystem();
    });
};

EffekseerSystem.prototype.update = function(dt) {
    var context = window.playCanvasEffekseerSystem.context;
    var camera = this.app.root.findByName('camera').camera;
    context.update();
    context.setProjectionMatrix(camera.projectionMatrix.data);
    context.setCameraMatrix(camera.viewMatrix.data);
};
