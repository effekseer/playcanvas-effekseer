/*jshint esversion: 6, asi: true, laxbreak: true*/

var EffekseerEmitter = pc.createScript('effekseerEmitter');

EffekseerEmitter.attributes.add("effect",  {
    type: 'asset',
    assetType: 'binary'
});

EffekseerEmitter.attributes.add("playOnEnter",  {
    type: 'boolean'
});

EffekseerEmitter.attributes.add("scale",  {
    type: 'number',
    default: 1.0,
});


EffekseerEmitter.prototype.initialize = function() {

    // TODO : it is better to wait or find effekseer system
    window.createPlayCanvasEffekseerSystem(this.app);
    
    if(this.effect)
    {
        theApp = this.app;
        var redirectFuc = function redirect(src) {
            var srcs = src.split('/');
            var filename = srcs[srcs.length-1];
            var asset = theApp.assets.find(filename);
            if(!asset) return src;
            return asset.getFileUrl();
        };


        console.log(this.effect);
        console.log(this.effect.getFileUrl());
        var context = window.playCanvasEffekseerSystem.context;
        this.effekseer_effect = context.loadEffect(this.effect.getFileUrl(), this.scale, () => {}, () => {}, redirectFuc);
    }
    
    // TODO : it is better to wait or find effekseer system
    this.on("destroy", function () {
        window.deletePlayCanvasEffekseerSystem();
    });
    
    this._handles = [];
    this._commands = [];
    
    if(this.playOnEnter) {
        this.play();
    }
};

EffekseerEmitter.prototype.update = function(dt) {
    
    // execute commands
    if(this.effekseer_effect && this.effekseer_effect.isLoaded)
    {
        this._commands.forEach(function (v) { v(); });
        this._commands = [];
    }
    
    // remove finished handles
    this._handles = this._handles.filter(function(item) {
        return item.exists;
    });
    
    // update transforms
    for(var i = 0; i < this._handles.length; i++)
    {
        var transform = this.entity.getWorldTransform();
        this._handles[i].setMatrix(Array.prototype.slice.call(transform.data));
    }
};

EffekseerEmitter.prototype.play = function() {

    var f = function () { 
        var context = window.playCanvasEffekseerSystem.context;
        var handle = context.play(this.effekseer_effect, 0, 0, 0);
        var transform = this.entity.getWorldTransform();
        handle.setMatrix(Array.prototype.slice.call(transform.data));
        this._handles.push(handle);
    }.bind(this);
    
    if(this.effekseer_effect && this.effekseer_effect.isLoaded)
    {
        f();
    }
    else
    {
        // execute delay
        this._commands.push(f);
    }
};
