# PlayCanvas with EffekseerForWebGL

- [Official website](http://effekseer.github.io)
- [Effekseer repository](https://github.com/effekseer/Effekseer)
- [EffekseerForWebGL repository](https://github.com/effekseer/EffekseerForWebGL)

## How to use

### PlayCanvas Editor

Import all files in src/

Specify a name and a script into effekseer_native.wasm

![](docs/images/wasmModule.png)

Add entities

![](docs/images/AddEntity.png)

Add EffekseerSystem to an entity. Set the Entity of the camera to the Camera attribute.

![](docs/images/EffekseerSyatemScript.png)

Add EffekseerEmitter to an entity

Specify efkefc file.

![](docs/images/EffekseerEmitterScript.png)

Effect can be played with this code

```
this.entity.script.effekseerEmitter.play();
```

Please look at PlayCanvas Project in a detail.

[Project](https://playcanvas.com/project/649529/overview/effekseersimplesample)

## Development

### How to copy from EffekseerForWebGL

- Rename

effekseer.wasm -> effekseer_native.wasm

- Fix code

Get a module directly

```
  var _initalize_wasm = function _initalize_wasm(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      var params = {};
      params.wasmBinary = xhr.response;
      // params.onRuntimeInitialized = _onRuntimeInitialized;
      Module = window["effekseer_native"];
      _onRuntimeInitialized();
    };
    xhr.onerror = function () {
      _onerrorAssembly();
    };
    xhr.send(null);
  };
```
