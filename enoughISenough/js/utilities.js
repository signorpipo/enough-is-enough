var utilities = {

    // Negative depth means all the hierarchy
    getComponentWithChildren: function (object, componentName, depth) {
        let objComponent = object.getComponent(componentName);
        if (objComponent) {
            return objComponent;
        }

        if (depth == 0) {
            return null;
        }

        let children = object.children;

        for (let i = 0; i < children.length; i++) {
            objComponent = utilities.getComponentWithChildren(children[i], componentName, depth - 1);
            if (objComponent) {
                break;
            }
        }

        return objComponent;
    },

    reparentKeepTransform: function (object, newParent) {
        let tempTransform = new Float32Array(8);

        glMatrix.quat2.conjugate(tempTransform, newParent.transformWorld);
        glMatrix.quat2.mul(tempTransform, tempTransform, object.transformWorld);

        object.parent = newParent;
        object.transformLocal.set(tempTransform);
    }

}