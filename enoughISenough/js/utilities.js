var utilities = {

    // Negative depth means all the hierarchy
    getComponentWithChildren: function(object, componentName, depth){
        var objComponent = object.getComponent(componentName);
        if(objComponent){
            return objComponent;
        }

        if(depth == 0){
            return null;
        }

        var children = object.children;

        for(var i=0; i < children.length; i++){
            objComponent = utilities.getComponentWithChildren(children[i], componentName, depth-1);
            if(objComponent){
                break;
            }
        }

        return objComponent;
    }

}