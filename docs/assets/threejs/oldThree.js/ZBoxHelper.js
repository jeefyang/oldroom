function ZBoxHelper(_scene, _camera, _canvasSize) {
    this.model = null;
    this.lineColor = 0xff0000;
    this.scene = _scene;
    this.camera = _camera;
    this.canvasSize = _canvasSize;

    this.unit = "mm";
    this.unitScale = 1.0;  //长宽高的比例。

    this.boundGeometry = null;
    this.boundMesh = null;

    this.__lengthDiv = null;
    this.__widthDiv = null;
    this.__heightDiv = null;
    //显示长度的文本变换前的位置。
    this.__formerlengthPoint = new THREE.Vector3();
    //显示宽度的文本变换前的位置。
    this.__formerWidthPoint = new THREE.Vector3();
    //显示高度的文本变换前的位置。
    this.__formerHeightPoint = new THREE.Vector3();
    //模型的初始位置。
    this.__formerCenterPoint = new THREE.Vector3();

    this.__visibled = false;
}

(function () {
    //初始化网页元素。
    ZBoxHelper.prototype.init = function () {
        var container = document.createElement("div");
        document.body.appendChild(container);

        this.__lengthDiv = document.createElement("div");
        this.__lengthDiv.style.position = "absolute";

        this.__widthDiv = document.createElement("div");
        this.__widthDiv.style.position = "absolute";

        this.__heightDiv = document.createElement("div");
        this.__heightDiv.style.position = "absolute";

        container.appendChild(this.__lengthDiv);
        container.appendChild(this.__widthDiv);
        container.appendChild(this.__heightDiv);
    }
    //根据模型产生新的boundingBox。
    ZBoxHelper.prototype.makeBox = function () {
        var parentModel = this.model.parent instanceof THREE.Scene ? this.model : this.model.parent;
        this.model.geometry.computeBoundingBox();

        var boundingBox = this.model.geometry.boundingBox;

        if (this.boundMesh != null) {
            this.scene.remove(this.boundMesh);
        }
        if (this.boundGeometry != null) {
            this.boundGeometry.dispose();
        }
        this.boundGeometry = new THREE.Geometry();
        this.boundGeometry.vertices.push(
            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),

            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z)
        );
        this.boundMesh = new THREE.LineSegments(this.boundGeometry, new THREE.LineBasicMaterial({
            color: this.lineColor
        }));



        this.boundMesh.position.copy(parentModel.position);
        this.boundMesh.rotation.copy(parentModel.rotation);
        this.boundMesh.scale.copy(parentModel.scale);
        this.scene.add(this.boundMesh);

        //计算显示文本的位置。
        this.__formerlengthPoint.x = (boundingBox.max.x + boundingBox.min.x) * parentModel.scale.x / 2 + parentModel.position.x;
        this.__formerlengthPoint.y = boundingBox.max.y * parentModel.scale.y + parentModel.position.y;
        this.__formerlengthPoint.z = boundingBox.min.z * parentModel.scale.z + parentModel.position.z;

        this.__formerWidthPoint.x = boundingBox.max.x * parentModel.scale.x + parentModel.position.x;
        this.__formerWidthPoint.y = boundingBox.max.y * parentModel.scale.y + parentModel.position.y;
        this.__formerWidthPoint.z = (boundingBox.max.z + boundingBox.min.z) * parentModel.scale.z / 2 + parentModel.position.z;

        this.__formerHeightPoint.x = boundingBox.max.x * parentModel.scale.x + parentModel.position.x;
        this.__formerHeightPoint.y = (boundingBox.max.y + boundingBox.min.y) * parentModel.scale.y / 2 + parentModel.position.y;
        this.__formerHeightPoint.z = boundingBox.min.z * parentModel.scale.z + parentModel.position.z;

        this.__formerCenterPoint.copy(this.boundMesh.position);

        this.__lengthDiv.innerText = ((boundingBox.max.x - boundingBox.min.x) * parentModel.scale.x * this.unitScale).toFixed(2) + this.unit;
        this.__widthDiv.innerText = ((boundingBox.max.z - boundingBox.min.z) * parentModel.scale.y * this.unitScale).toFixed(2) + this.unit;
        this.__heightDiv.innerText = ((boundingBox.max.y - boundingBox.min.y) * parentModel.scale.z * this.unitScale).toFixed(2) + this.unit;
        this.show();

    }
    ZBoxHelper.prototype.show = function () {
        if (this.boundMesh != null) {
            this.boundMesh.visible = true;
        }
        this.__lengthDiv.style.display = "inline";
        this.__widthDiv.style.display = "inline";
        this.__heightDiv.style.display = "inline";
        this.__visibled = true;
    }
    ZBoxHelper.prototype.hide = function () {
        if (this.boundMesh != null) {
            this.boundMesh.visible = false;
        }
        this.__lengthDiv.style.display = "none";
        this.__widthDiv.style.display = "none";
        this.__heightDiv.style.display = "none";
        this.__visibled = false;
    }

    ZBoxHelper.prototype.rotateWithModel = function () {
        var parentModel = this.model.parent instanceof THREE.Scene ? this.model : this.model.parent;
        if (this.boundMesh != null && parentModel != null) {
            this.boundMesh.rotation.copy(parentModel.rotation);
        }
    }

    ZBoxHelper.prototype.moveWidthModel = function () {
        var parentModel = this.model.parent instanceof THREE.Scene ? this.model : this.model.parent;
        if (this.boundMesh != null && parentModel != null) {
            this.boundMesh.position.copy(parentModel.position);
        }
    }


    ZBoxHelper.prototype.SetWordPosition = function () {
        //计算长度文本显示点的位置。
        setDivPos(this.__formerlengthPoint, this.boundMesh.position, this.__formerCenterPoint, this.boundMesh.rotation.y, this.camera, this.__lengthDiv, this.canvasSize);
        setDivPos(this.__formerWidthPoint, this.boundMesh.position, this.__formerCenterPoint, this.boundMesh.rotation.y, this.camera, this.__widthDiv, this.canvasSize);
        setDivPos(this.__formerHeightPoint, this.boundMesh.position, this.__formerCenterPoint, this.boundMesh.rotation.y, this.camera, this.__heightDiv, this.canvasSize);
    }

    function setDivPos(formerPoint, currentCenterPos, formerCenterPos, angle, camera, div, canvasSize) {

        var dir = formerPoint.clone().sub(formerCenterPos);
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        var lengthAbsPos = currentCenterPos.clone().add(dir);

        var lengthDivPos = lengthAbsPos.project(camera);

        if (lengthDivPos.x != NaN) {
            var tempLeft = (lengthDivPos.x + 1.0) * window.innerWidth / 2.0;
            var leftPos = canvasSize.x + (tempLeft / window.innerWidth) * canvasSize.width + "px";
            div.style.left = leftPos;
        }
        if (lengthDivPos.y != NaN) {
            div.style.top = (1.0 - lengthDivPos.y) * window.innerHeight / 2.0 + "px";
        }
    }

    ZBoxHelper.prototype.SetCanvasSize = function (_newCanvasSize) {
        this.canvasSize = _newCanvasSize;
    }

    ZBoxHelper.prototype.update = function () {
        if (this.__visibled) {
            this.SetWordPosition();
        }
    }

})()
